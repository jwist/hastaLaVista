# this script builds a clean dataset for demos

load("data-raw/bariatricRat.binned.5.rda")

bariatricRat.binned.5 <- bin

usethis::use_data(bariatricRat.binned.5, overwrite = TRUE)
