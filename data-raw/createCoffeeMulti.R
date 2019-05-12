# this script builds a clean dataset for demos from old coffee files
# these data were originally recorded at our lab at Universidad del Valle, Cali, Colombia
# by Julien Wist, Jessica Medina and Victoria Andrea Arana

load('data-raw/coffeeMulti.rda')
load('data-raw/ppm.binned.rda')

colnames(coffeeMulti$nmrBin) <- round(ppm.binned,3)
levels(coffeeMulti$nmrParam$country1) <- c("Brazil", "Colombia", "Peru")
levels(coffeeMulti$nmrParam$species) <- c("Unknown", "Arabica", "Mix", "Robusta", "l", "Arabica decaf.", "Robusta decaf.")

param <- coffeeMulti$nmrParam

coffeeNMRSpectra <-data.frame(param = param, nmr = coffeeMulti$nmrBin)

devtools::use_data(coffeeNMRSpectra)



