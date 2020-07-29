---
layout: post
title:  "Characterisation of human metabolic phenotypes using R"
date:   2020-08-28 23:31:34 -0500
categories: R, metabolic profiling, phenotyping
---

Characterising and understanding how human phenotypes relates to populations requires being able to count the occurrence of certain traits in individuals from different populations. Using NMR and MS based metabolic profiles, this means being able to estimate the presence of a **feature**, aka a signal, across the whole dataset aggregate the results by population and estimate if the occurrence vary significantly from one population to another. 

Because NMR is known to be quantitative, the ideal solution would be to extract the concentration of as many metabolites as possible and stratify these latter. However, this step is not always as trivial as it sounds. Instead of a proper quantification we could estimate the presence or absence of a signal, aka a trait, by the computing cross-correlation between a **feature of reference**, i.e., an arbitrarily chosen portion of the spectra with a well formed pattern (signal), and the same portion from other individuals.

A complete description of the process can be found [here][paper-link]

Here we describe how to get started with this approach using the [R code][compass-link] developed for this study. The code itself depends on two R packages, [`MetaboMate`][mm-link] for multivariate analysis and [`hastaLaVista`][hlv-link]  <img src="/hastaLaVista/assets/hlvLogo50px.png" alt="drawing" width="50px"/> for interactive visualization. For installing both packages, please refer to the **README** files provided with both packages.

## data modeling

In the github.com/cheminfo/COMPASS repository a demo [*multiblocking.R*](https://github.com/cheminfo/COMPASS/blob/master/multiblocking.R) file is provided that works with a demo [dataset][data-paper-link]. Running this file will chunk the dataset in blocks of 0.5 ppm and run a PCA for each of them. 

On line 24 of this demo file, the definition of the blocks can be modified according to the necessity:

{% highlight r %}
# define the blocks (here blocks of 0.5 ppm are preferred)
rangeList <- list(c(0.5, 1.000), 
                  c(1.0005, 1.5), 
                  c(1.5005, 2), 
                  c(2.0005, 2.5), 
                  c(2.5005, 3), 
                  c(3.0005, 3.5), 
                  c(3.5005, 4.0), 
                  c(6.5005, 7),
                  c(7.0005, 7.5),
                  c(7.5005, 8),
                  c(8.0005, 8.5),
                  c(8.5005, 9),
                  c(9.0005, 9.49))
{% endhighlight r %}

If you are planning to use very large dataset, the loading of the dataset into the browser for interactive visualization may become impractical. Instead, [`hastaLaVista`][hlv-link]  <img src="/hastaLaVista/assets/hlvLogo50px.png" alt="drawing" width="50px"/> could be configured to retrieve the spectra only when necessary. For this, uncomment lines 45-53 and define a path to store the JSON. Each spectrum will be converted into a single JSON files to make the interaction fast and efficient.

To do that you must locate the folder where hastalavista is stored in your installation. This is achieved using the `.libPathts()` command and then creating the folder `visu/data/json`. Line 46 must point to this json folder.

Running this script will point your default browser on the URL

```
http://127.0.0.1:5474/?viewURL=http://127.0.0.1:5474/view/modelExplorer_1_1.view.json&dataURL=http://127.0.0.1:5474/data/multiblocking.data.json
```

and you should see the following page where you can explore the scores and loadings for all the blocks, the results for the whole PCA and super scores and superloadings that are reconstructions based on all blocks. Using Alt-click it is possible to select scores and then select spectra that are to be displayed. 

This **view** (vista in Spanish) allows one to explore the dataset and identify with a high level of granularity the features of interest.

<img src="/hastaLaVista/assets/model-explorer.gif" alt="drawing" width="800px"/>

## feature identification and selection

A nice feature of the view allows to select spectra from the score plot and the use these data to compute [STOCSY](http://dx.doi.org/10.1021/ac048630x). The driver peak to compute STOCSY is simple set by Alt-click on the selected spectra. A STOCSY trace will appear in the middle gray area that allows to identify features that belongs to the same molecules. 

<img src="/hastaLaVista/assets/stocsy.gif" alt="drawing" width="800px"/>

## computing cross-correlation

In the github.com/cheminfo/COMPASS repository a demo [*MBCC-metaboliteX.Rmd*](https://github.com/cheminfo/COMPASS/blob/master/MBCC-metaboliteX.Rmd) file is provided that works with a demo [dataset][data-paper-link].

The following code chunk from the demo file allows to select the feature that will be used as a reference. For this example we selected two feature, a triplet and a doublet that are well resolved in the first sample (ID = 1). 

{% highlight r %}
patternID <- 1
identifier = ID
L = length(ID)
# several ranges may be defined and combined to create a pattern
# define here the range that should be used
F <- which(x_axis > 2.42 & x_axis < 2.47)
rangeList <- list(F)
{% endhighlight r %}

The reference features are shown here:

<img src="/hastaLaVista/assets/patternX_4117" alt="drawing" width="800px"/>
<img src="/hastaLaVista/assets/patternX_4910" alt="drawing" width="800px"/>

And finally we can compute and display the cross-correlation with as shown in the following chunk.

{% highlight r %}
# define here what information should be used as a category or a group
colorCode <- metadata$Class

ccList = list()

for (i in seq_along(rangeList)) {
  F <- rangeList[[i]]
  subX <- X[, F]
  
  pattern <- as.numeric(subX[which(identifier == patternID),])
  
  pattern[pattern == 0] <- 1e-04
  dil.F <- 1/apply(subX, 1, function(x) median(x/pattern))
  subX.scaled <- subX * dil.F
  
  res <- apply(subX.scaled, 1, function(x) {
    ccf(pattern, x, lag.max = 10, plot = FALSE, type = c("correlation"))
  })
  
  r <- unlist(lapply(res, function(x) max(x$acf)))
  par(mar=c(4,4,2,4))
  plot(r,
       main = paste0(metabolite, ": cc colored by country (pattern: ", patternID, ")"),
       xlab = "sample index",
       ylab = "cross-correlation",
       cex.main = 2,
       cex.lab = 2,
       cex.axis = 2,
       cex = 2,
       col = colorCode)
  ccList[[i]] <- unname(r)
}
{% endhighlight r %}

Results are shown here:

<img src="/hastaLaVista/assets/ccX_1" alt="drawing" width="800px"/>
<img src="/hastaLaVista/assets/ccX_2" alt="drawing" width="800px"/>

These figures enable the selection of samples with highest correlation. Although cross-correlation is insensitive to shifts, it is sensitive to distortions of the pattern due to overlap for example. Therefore it is necessary to visually inspect the results. Since this inspection is mandatory but is cumbersome, we made efforts to provide the best interface possible to quickly check the results.

The first approach used in this demo script consists of defining two threshold that define three areas, green for spectra with CC above all thresholds, orange between the two limits and red below. This semaphore system allows to quickly check the results.

Examples of figures are shown below.

<img src="/hastaLaVista/assets/greenX_37" alt="drawing" width="800px"/>
<img src="/hastaLaVista/assets/greenX_38" alt="drawing" width="800px"/>
<img src="/hastaLaVista/assets/orangeX_40" alt="drawing" width="800px"/>
<img src="/hastaLaVista/assets/orangeX_44" alt="drawing" width="800px"/>

The second option makes use of the [`hastaLaVista`][hlv-link]  <img src="/hastaLaVista/assets/hlvLogo50px.png" alt="drawing" width="50px"/> package to make the visualization interactive, as shown here:

<img src="/hastaLaVista/assets/cross-corr_explorer0.1.gif" alt="drawing" width="800px"/>



[hlv-link]: https://github.com/jwist/hastaLaVista
[mm-link]: https://github.com/kimsche/MetaboMate
[hlv-blog]: https://jwist.github.io/hastaLaVista/r/2019/11/28/interactive-visualization-with-R.html
[compass-link]: https://github.com/cheminfo/COMPASS
[paper-link]: https://doi.org/10.1093/bioinformatics/btaa649
[data-paper-link]: https://doi.org/10.3389/fmicb.2011.00183