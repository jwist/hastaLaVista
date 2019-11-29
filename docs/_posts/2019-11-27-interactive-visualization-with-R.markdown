---
layout: post
title:  "interactive visualization with R"
date:   2019-11-27 20:06:34 -0500
categories: R 
---

Interactive data visualization is a must to develop attractive tools for a broad audience. Here I will show how to use a JavaScript framework to visualize results computed with R. I think it is a good idea to keep computation separated from visualization to make more robust pipelines, hence the idea to use a webpage as a visualization platform.

[`visualizer`][visu-link] is a webpage (a tool) that takes data as input and display them according to a customizable layout (a view, or vista in spanish). [`visualizer`][visu-link] allows to define modules that can display many different types of data and that can be chained to build complex pipelines. Since this package is build with pure JavaScript, code can be added to modules to allow even more complex manipulation of the results.

[`visualizer`][visu-link] needs two files, a data.json file that contains the data or result to be displayed in json format and a view.file that contains the description of how to display the data.

Both those files can be produced by an R script and pushed to the webpage. This is what [`hastaLaVista`][hlv-link]  <img src="/hastaLaVista/assets/hlvLogo50px.png" alt="drawing" width="50px"/> R-package.

### getting started

First install the latest release of <img src="/hastaLaVista/assets/hlvLogo50px.png" alt="drawing" width="50px"> using devtools. 

{% highlight r %}
devtools::install_github("jwist/hastaLaVista")
{% endhighlight %}

### check your install

You can check that installation has been successful by loading demo files.

{% highlight r %}
library(hastaLaVista)
v <- new("visualization")
v@data <- "test.data.json"
v@view <- "test.view.json"
visualize(v)
{% endhighlight %}

In this case, no computation is performed, but R will push two files test.data.json and test.view.json that are available with the package. In case of success, you should see this: <img src="/hastaLaVista/assets/hlv-test.gif" alt="drawing" width="700px">

Beware that it may take some while to load the first time. **Be patient!**

Hovering over the data points in the plot will display information about them. This is a first example of interactive display.

## how does it works?

as a simple example we can display a sine and a cosine function. With the result we create a data.frame structure that contains the following elements: x, y, _highlight and info. It is important to respect these names, since they will be used to create JSON object that will be read and interpreted by the vista (view.json). 

{% highlight r %}
 x <- seq(from = 0, to = pi, by = 0.1)

 chart1 <- data.frame("x" = x,
                      "y" = cos(3*x),
                      "_highlight" = seq_along(x) - 1,
                      "info"= paste0("cosID: ", 0:31)
                      )

 chart2 <- data.frame("x" = x,
                      "y" = sin(3*x),
                      "_highlight" = seq_along(x) - 1,
                      "info"= paste0("sinID: ", 0:31)
                      )
{% endhighlight %}

Each data.frame will be added to a list structure. This list is later converted into a single JSON object that contains all the variables needed for display. Each variable will be converted into an object in the JSON file (data.json).

{% highlight r %}
 chart = list( list(chart=chart1), list(chart=chart2))
 d <- appendData( data = d, variableName = "multiChart", variable = chart, type = "multiChart")
{% endhighlight %}

The above command will add the data.frames "chart" to the list with name "multiChart". The `type = "multiChart"` ensures that the information in the data.frame is converted into a chart object to be interpreted by the module "spectra displayer" of the *visualizer* package.

Once the results are all stored into the list structure, a visualization object is created as described below:
 
 {% highlight r %}
 v <- new('visualization')
 v@data <- "test.data.json"
 v@view <- "test.view.json"
 push(v, 'data', d)
 visualize(v)
{% endhighlight %}

The first line create the object, while the second and third lines defines names for the files to be served. The file "test.data.json" will be created with the `push(v, 'data', d)` command. The `v@view` allows to tell <img src="/hastaLaVista/assets/hlvLogo50px.png" alt="drawing" width="50px"> what *vista* to use. This file must exist.

The last line `visualize(v)` will start a webserver (based on *servr* package) and point your default browser to the correct URL.

The command `print(v)` allows to print that URL for later use, to avoid having to recompute the analysis.

A closer look to this URL shows it is composed of three parts:

{% highlight js %}
http://127.0.0.1:5474/?viewURL=http://127.0.0.1:5474/view/test.view.json&dataURL=http://127.0.0.1:5474/data/test.data.json
{% endhighlight %}

The first part `http://127.0.0.1:5474/` must point to the *visualizer* root directory. This folder *visu* is placed inside the package system folder that can be found using the command `path.package("hastaLaVista")`. The webserver will use this folder rootDirectory/visu/ to serve information, which means that all the files that are placed in there could be served. 

The second part `?viewURL=http://127.0.0.1:5474/view/test.view.json` is a parameter passed to the *visualizer* and it tells where to find the *vista*. In this case the file is to be found in rootDirectory/visu/view/

The third part `dataURL=http://127.0.0.1:5474/data/test.data.json` tells where to find the data. In this case in rootDirectory/visu/data/

[visu-link]: https://github.com/npellet/visualizer
[hlv-link]: https://github.com/jwist/hastaLaVista
[mm-link]: https://github.com/kimsche/MetaboMate
[bioc-link]: https://bioconductor.org/install/
[demoView.png]: https://github.com/jwist/hastaLaVista/blob/master/inst/visu/bin/help/demoView.png