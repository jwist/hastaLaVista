# this script builds a clean dataset for demos

load("data-raw/bariatricRat.binned.4.rda")

bariatricRat.binned.4 <- bin

usethis::use_data(bariatricRat.binned.4, overwrite = TRUE)
