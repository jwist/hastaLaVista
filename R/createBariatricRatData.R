# this script builds a clean dataset for demos

load("data-raw/bariatricRat.rda")

bariatricRat <- list("metadata" = I(metadata), "X" = I(X), "ppm" = ppm)

usethis::use_data(bariatricRat, overwrite = TRUE)
