
context("testing append and push")


test_that("append appends and push creates file", {
  x <- seq(from = 0, to = pi, by = 0.1)
  d <- appendData(variableName = "simpleArray", variable = cos(x), type = "1D Y array")
  d <- appendData(data = d, variableName = "simpleArray2", variable = sin(x), type = "1D Y array")

  expect_equal(length(d), 2)
  expect_equal(sum(names(d) == c("simpleArray", "simpleArray2")), 2)

  v <- new("visualization")
  push(v, type = "data", d)

  pathToFile <- file.path( system.file(package = "hastaLaVista"), "visu", "data", "data.json" )
  expect_true(system(paste("ls", pathToFile)) == 0)

  view <- list()
  push(v, type = "view", view)

  pathToFile <- file.path( system.file(package = "hastaLaVista"), "visu", "view", "view.json" )
  expect_true(system(paste("ls", pathToFile)) == 0)

})
