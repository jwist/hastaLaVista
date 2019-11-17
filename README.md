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

## installation

Make sure that *devtools* package is installed and run the following command in the R console. 

`devtools::install_github("jwist/hastaLaVista")`

## post-installation

*hastaLaVista* will convert the results of the analysis into a JSON object and store it into a file. Both data and the vista files are served by the webserver and are therefore stored in the folder where the package is installed, usually within the home folder of the user. If data are large it may be necessary to clean the old dataset periodically. To find out where the data are being stored use the following command (make sure that the library is loaded):

`path.package("hastaLaVista")`

This will ouput the path to the root directory of the package. The data are stored in the /visu/data folder while the views (vistas) will be found in the /visu/views files.

**Because the files are stored, it is later possible visualize the data in the browser even without having an active R session (See next section to use an alternative webserver**

### alternative webserver

Some users may feel happier by using the webserver of their choice. Once the visualization object is ready in R, the print() function will output the URL of for the visualization. To use an alternative webserver, just serve the /visu folder. For example, go into the visu folder and type the following command:

`python3 -m http.server 5474 --bind localhost`

if you prefer to use python build in webserver. This is particularily usefull to visualize old results without having to fire an R session.