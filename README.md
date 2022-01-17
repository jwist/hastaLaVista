[![Build Status](https://travis-ci.org/jwist/hastaLaVista.svg?branch=master)](https://travis-ci.org/jwist/hastaLaVista)
[![Coverage Status](https://coveralls.io/repos/github/jwist/hastaLaVista/badge.svg?branch=master)](https://coveralls.io/github/jwist/hastaLaVista?branch=master)
[![DOI](https://zenodo.org/badge/186240224.svg)](https://zenodo.org/badge/latestdoi/186240224)

If you find it useful, please cite this work [![DOI](https://zenodo.org/badge/DOI/10.1186/s13321-019-0399-7.svg)](https://doi.org/10.1186/s13321-019-0399-7)

A blog with a more detailed tutorial can be found here: https://jwist.github.io/hastaLaVista/

# hastaLaVista
R package that provide interactive graphical interface for metabolic profiling

![HLV Logo](/inst/visu/bin/logo/hlvLogo.png)

## introduction

This package allows 
1. to convert R variables into a JSON object and save it as a file 
1. to select a view (vista) file for the visualization of the data
1. to start a webserver with both data and view files

Vistas (views) are files that contains the description of how to visualize data or results. This can be regarded as a notebook (jupyter) that transforms and displays information. Notebooks, and vistas, can read data from an external file. So if data is updated, the analysis can easily be computed again. It also allows to readily share a data analysis pipeline with others. 

Some analysis are very common and performed by many researchers. Thus, generic vistas could be used by many to process and visualize their own results.

Notebooks already offer this possibility, however notebooks only provide basic features for visualizing results, usually as plain static figures. Unlike notebooks, vistas are complex web applications that can provide a much enhanced interactivity to display and play with results.

**hastaLaVista is developed and tested using Chrome, although it is known to work with other browser. In the case that a feature is not working as expected please try using Chrome before filling an issue**

## installation

Make sure that *devtools* package is installed and run the following command in the R console. 

    options(timeout=1000)
    devtools::install_github("jwist/hastaLaVista")

## post-installation

*hastaLaVista* will convert the results of the analysis into a JSON object and store it into a file. Both data and the vista files are served by the webserver and are therefore stored in the folder where the package is installed, usually within the home folder of the user. If data are large it may be necessary to clean the old datasets periodically. To find out where the data are being stored use the following command (make sure that the library is loaded):

    path.package("hastaLaVista")

This will print the path to the root directory of the package. The data are stored in the /visu/data folder while the views (vistas) will be found in the /visu/views files.

**Because the files are stored, it is later possible to visualize the data in the browser even without having an active R session (See next section to use an alternative webserver**

### alternative webserver

Some users may feel happier by using the webserver of their choice. Once the visualization object is ready in R, the print() function will output the URL of for the visualization. To use an alternative webserver, just serve the /visu folder. For example, go into the visu folder and type the following command:

    python3 -m http.server 5474 --bind localhost

if you prefer to use python build in webserver. This is particularly useful to visualize old results without having to fire up an R session.

### large files

To avoid loading very large datasets into the browser it is possible to individually store original files (spectra) within the /visu/data/json folder. This way the vista will be able to access the original data on the fly using their URL. To do so it is mandatory that the files are stored within the reach of the webserver, in this case within its root folder /visu

### use local folder

Maybe you are using a folder to store the inputs and outputs of your analysis. In this case, you may prefer to have the data (and the view, if you modify it) stored locally instead of filling the package folder with data.
The method `useThisFolder()` allows the user to create a symbolic link within the webserver root directory (pathToPackage/visu/) that points to the current folder.

    v <- new("visualization")
    useThisFolder(v)
    v@data <- "test.data.json"
    v@view <- "test.view.json"
    visualize(v)

** The command will create a symbolic link to current working directory ** Use `getwd()` to check in what directory you are currently working

## quick start

To quickly test the package a very simple test demo is available. Just type the following commands in the R console.

    library(hastaLaVista)
    v <- new("visualization")
    v@data <- "test.data.json"
    v@view <- "test.view.json"
    visualize(v)

if you are using an alternative webserver, use the following url to test the demo view

    http://127.0.0.1:5474/?viewURL=http://127.0.0.1:5474/view/test.view.json&dataURL=http://127.0.0.1:5474/data/test.data.json

If your installation is working you should be able to see this:

![HLV test demo](/inst/visu/bin/help/demoView.png)

### bariatric rat demo

To get a feeling of the interface, use the following lines to explore a demo analysis performed on 59 urine samples of rats.

    v4 <- new("visualization")
    v4@data <- "rat_bariatric_dataExplorer.data.json"
    v4@view <- "dataExplorer_1_1.view.json"
    visualize(v4)

if you are using an alternative webserver, use the following url to test the demo view
    
    http://127.0.0.1:5474/?viewURL=http://127.0.0.1:5474/view/dataExplorer_1_1.view.json&dataURL=http://127.0.0.1:5474/data/rat_bariatric_dataExplorer.data.json

The result should look like this:

![HLV test demo](/inst/visu/bin/help/dataExplorer_1_1.gif)

### real start

The previous demo illustrated the last two points mentioned in the introduction, i.e., the visualization of existing results (data.json). The examples in this section illustrate how to run the analysis in R and then push the outcome into a data.json file for visualization. 

Four examples are provided for untargeted analysis of metabolic profiles. 

**Multivariate statistics is performed using the *MetaboMate* R package. Please refer to its repository for installation at https::/github.com/kimsche/MetaboMate. *Metabomate* itself requires the installation of 3 packages from Bioconductor (https://bioconductor.org). The 3 packages have to be installed using the bioductor package manager before *MetaboMate* could be installed.**

The following command should work once BiocManager has been installed (https://bioconductor.org/install/)

    BiocManager::install(c("MassSpecWavelet", "impute", "pcaMethods"))

Four examples to explore spectra according to metadata, to explores data from scores, to help with identification of reference compounds and to check univariate statistics after multivariate analysis.

1. https://gist.githubusercontent.com/jwist/289f1fa14f8583cf7a062bc9c9b34df5/raw/27400cda47546c4c9df4a2650c9a96d5d72bc550/BariatricRats_dataExplorer.r
1. https://gist.githubusercontent.com/jwist/517323d9e3176c9f9509e0f2293cba3c/raw/67f9e1305879c8712d99a483dcccbe7556bfe7f3/BariatricRats_scoresExplorer.r
1. https://gist.githubusercontent.com/jwist/43854bfe60c0b245c8df794502b88f6c/raw/d9133642645be3efbd65845eb7a55cdd1cbff937/BariatricRats_metaboscope.r
1. https://gist.githubusercontent.com/jwist/88eef3bdc73f2991b18396a533ca96c5/raw/0a4505e4907519fec7243eed4eeac0a21003488f/BariatricRats_univariate.r

## preparing results for visualization

The results of the analysis must be reshaped to be used in the `visualizeR` pipeline. For the first example presented in the previous section at least the following information must be available.

* a vector `ID` of **unique** IDs that is used to identify each entry or sample
* a vector `group` that describes to which class each sample belong
* a table `metadata` of information that belong to each sample and that will be displayed 
* a matrix `x` that contains the data. Each row represents a sample, each columns a variable
* a vector `x_axis` that contains the names or values of each variable

A demo dataset is available with *hastaLaVista*. A complete description of the dataset can be found here: https://www.frontiersin.org/articles/10.3389/fmicb.2011.00183

### load a dataset

As a starter we recommend to use the demo dataset provided with *hastaLaVista* package. This dataset `bariatric` contains a matrix `bariatricRat$X` with the original data (the spectra) and a vector `bariatricRat$ppm` that contains information about the x-axis. Finally, it contains a data.frame `bariatricRat$metadata` with metadata that can be used to explore and colour the data.

```r
data("bariatricRat")
X <- bariatricRat$X
ppm <- bariatricRat$ppm
metadata <- bariatricRat$metadata
```
### label the information

Here we just make sure that we have all the information that is needed by the vista. The name of the variable are self-explanatory. ID, group, metadata, x and color have the same number of rows, one row for each sample (observation). x and x_axis have the same number of columns, one for each measured variables. The metadata has an arbitrary number of columns.

```r
ID <- metadata$Sample.Label
group <- metadata$Class
metadata <- data.frame(metadata)
x <- matrix(X, dim(X)[1], dim(X)[2])
x_axis <- as.numeric( ppm )
color = sapply(group, function(x) getColor2(as.character(x)))
```
Once the information is correctly labelled we create a data.frame. **The name of the variables within the data.frame must NOT be changed, since the vista is expecting these latter under those pre-defined names (ID, group, color, _highlight, dataMatrix, metadata). 

```r
bariatric <- data.frame(ID = ID,
                group = group,
                color = color,
                "_highlight" = seq_along(group) - 1,
                dataMatrix = I(matrix( c(rbind(repRow(x_axis, nrow(x)), x)), nrow(x), ncol(x)*2)),
                metadata = I(metadata),
                check.names = FALSE)
```
The _highlight variable contains unique identifiers for each samples, here a simple number is given. **Make sure that values in this vector are unique**

### append the data for export

Once the variable that must be converted to JSON objects are ready we will add them to a list. This list will be exported as a single JSON object containing all the variables, i.e., all the items of the list. **Make sure that the list is empty, otherwise the `appendData()` function will just add another item to the end of the existing list**

```r
d <- list()
d <- appendData(data = d, variableName = "data", variable = bariatric, type = "table")
```
This command will add an item `bariatric` (arbitrary name) to the list that will be named "data" (mandatory name). Again it is important to note that the vista is expecting an object `data` that contains objects `ID`, `group`, `color`, `_highlight`, `dataMatrix` and `metadata`.

## configure visualization and write the data.json

It is time now to setup the visualization. Therefore an object `v` is created of class visualization. The `v@view` allows to define the vista (view) that will be served. `v@data` allows to give a name to the data.json file that will be used to serve the data. The `push()` function takes the list `d` and write the json file into the pathToRootDirectory/visu/data folder (see previous section to find out where this folder is https://github.com/jwist/hastaLaVista#post-installation). Finally the function `visualize()` will start a webserver and point your default browser to the correct local URL. The function `print(v)` will display the URL if an alternate webserver is used.

```r
v <- new("visualization")
v@view <- "spectraExplorer3.1.view.json"
v@data <- "spectraExplorer3.data.json"
push(v, type="data", d)
visualize(v)
```
**Since both the view and data files are stored on the disk, this URL can be later used again to visualize the results without running the analysis again. Just make sure that a webserver is started.**

To run again the visualization from R without re-running the analysis, just use the following command instead:

```r
v <- new("visualization")
v@view <- "spectraExplorer3.1.view.json"
v@data <- "spectraExplorer3.data.json"
visualize(v)
```
We just remove the `push()` command to avoid overwriting the data json file.

## acknowledgements

The author of this package wishes to thank Luc Patiny and Elaine Holmes for their invaluable inputs during years of collaborations, Jia Li and Hutan Ashrafian for provision of the urine spectra, Norman Pellet for his great contribution to our research group as an original contributor to the visualizer project (https://github.com/npellet/visualizer), Michael Zasso and Daniel Kostro as current contributors to the visualizer, Torben Kimhoffer for his advice on multivariate analysis, Andrés Mauricio Castillo and Alejandro Bolaños for their help with my first steps using javaScript.
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTI1NjA1OTAxNF19
-->