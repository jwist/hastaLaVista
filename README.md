[![Build Status](https://travis-ci.org/jwist/hastaLaVista.svg?branch=master)](https://travis-ci.org/jwist/hastaLaVista)
[![Coverage Status](https://coveralls.io/repos/github/jwist/hastaLaVista/badge.svg?branch=master)](https://coveralls.io/github/jwist/hastaLaVista?branch=master)


# hastaLaVista
R package that provide interactive graphical interface for metabolic profiling

![HLV Logo](/inst/visu/bin/logo/hlvLogo.png)

## introduction

This package enables 
1. the convert R variables into a JSON object and save it as a file 
1. to select a view (vista) file for the visualization of the data
1. to start a webserver with both data and view files

Vistas (views) are files that contains the description of how to visualize data. The can be regarded as a notebook that transforms and displays information. Notebook, and vistas, can read data from an external file. So if data are updated, the analysis can be easily computed again. It also allows to readily share a data analysis pipeline to others. 

Some analysis are very common and performed by many researchers. Thus, generic vistas could be used by many to process and visualize their own results.

Notebook already offer this possibility, however notebooks only provide basic feature for visualizing results, usually as plain static figures. Unlike notebooks, vistas are complex web applications that can provide a much enhanced interactivity to display and play with results.

**hastaLaVista is developped and tested using Chrome, although it is known to work with other browser. In the case that a feature is not working as expected please try using Chrome before filling an issue**

## installation

Make sure that *devtools* package is installed and run the following command in the R console. 

    devtools::install_github("jwist/hastaLaVista")

## post-installation

*hastaLaVista* will convert the results of the analysis into a JSON object and store it into a file. Both data and the vista files are served by the webserver and are therefore stored in the folder where the package is installed, usually within the home folder of the user. If data are large it may be necessary to clean the old dataset periodically. To find out where the data are being stored use the following command (make sure that the library is loaded):

    path.package("hastaLaVista")

This will ouput the path to the root directory of the package. The data are stored in the /visu/data folder while the views (vistas) will be found in the /visu/views files.

**Because the files are stored, it is later possible visualize the data in the browser even without having an active R session (See next section to use an alternative webserver**

### alternative webserver

Some users may feel happier by using the webserver of their choice. Once the visualization object is ready in R, the print() function will output the URL of for the visualization. To use an alternative webserver, just serve the /visu folder. For example, go into the visu folder and type the following command:

    python3 -m http.server 5474 --bind localhost

if you prefer to use python build in webserver. This is particularily usefull to visualize old results without having to fire an R session.

### large files

To avoid loading very large dataset into the browser it is possible to individually store original files (spectra) within the /visu/data/json folder. This way the vista will be able to access the original data on the fly using their URL. To do so it is mandatory that the files are stored within the reach of the webserver, in this case within its root folder /visu

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

To get a feeling of the interface, use the following lines to explore a demo analysis performed on 59 urine sample of rats.

    v4 <- new("visualization")
    v4@data <- "rat_bariatric_dataExplorer.data.json"
    v4@view <- "dataExplorer_1_1.view.json"
    visualize(v4)

if you are using an alternative webserver, use the following url to test the demo view
    
    http://127.0.0.1:5474/?viewURL=http://127.0.0.1:5474/view/dataExplorer_1_1.view.json&dataURL=http://127.0.0.1:5474/data/rat_bariatric_dataExplorer.data.json

The result should look like this:

![HLV test demo](/inst/visu/bin/help/dataExplorer_1_1.gif)

### real start

The previous demo illustrated the last two points mentioned in the introduction, i.e., using existing results (data.json). The examples in this section illustrate how to run the analysis in R and then push the outcome into a data.json file for visualization. 

For examples are provided. Multivariate statistics is performed using the *MetaboMate* R package. Please refer to its repository for installation at https::/github.com/kimsche/MetaboMate. *Metabomate* itself requires the instalation of 3 packages from Bioconductor (https://bioconductor.org). The 3 packages have to be installed using the bioductor package manager before *MetaboMate* could be installed.

The following command should work once BiocManger has been installed (https://bioconductor.org/install/)

    BiocManager::install(c("MassSpecWavelet", "impute", "pcaMethods"))

1. https://gist.githubusercontent.com/jwist/289f1fa14f8583cf7a062bc9c9b34df5/raw/27400cda47546c4c9df4a2650c9a96d5d72bc550/BariatricRats_dataExplorer.r
1. https://gist.githubusercontent.com/jwist/43854bfe60c0b245c8df794502b88f6c/raw/d9133642645be3efbd65845eb7a55cdd1cbff937/BariatricRats_metaboscope.r
1. https://gist.githubusercontent.com/jwist/517323d9e3176c9f9509e0f2293cba3c/raw/67f9e1305879c8712d99a483dcccbe7556bfe7f3/BariatricRats_scoresExplorer.r
1. https://gist.githubusercontent.com/jwist/88eef3bdc73f2991b18396a533ca96c5/raw/0a4505e4907519fec7243eed4eeac0a21003488f/BariatricRats_univariate.r


