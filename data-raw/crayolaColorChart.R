# this script creates a color chart data from a csv file. The source were found on wikipedia.

crayola <- read.csv2("data-raw/crayola.csv", header = TRUE, sep = ",", dec = ".")
crayola$Hexadecimal <- sapply(crayola$Hexadecimal, function(x) substr(x,1,7))

devtools::use_data(crayola, internal = TRUE)
