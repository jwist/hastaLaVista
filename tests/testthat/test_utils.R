
context("testing utils")

test_that("repRow works", {
  expect_equal( nrow(repRow(c(1, 2, 3), 3)), 3)
})

test_that("repCol works", {
  expect_equal( ncol(repCol(c(1, 2, 3), 3)), 3)
})

test_that("getColor2 works", {
  expect_equal( getColor2("test", "rgb"), "rgba(97,64,81,1)")
  expect_equal( getColor2("test", "hex"), "#614051")
})
