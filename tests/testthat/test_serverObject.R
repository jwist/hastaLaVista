context("testing server objects and methods")

s <- new("server")
test_that("check number of slots in server object", {
  expect_equal(length(slotNames(s)), 6)
})

test_that("check print.server S3 method", {
  expect_equal(length(print(s)), 1)
  expect_is(print(s), "character")
})

test_that("check print.server S3 method: port", {
  s@port <- 0
  expect_equal(length(print(s)), 1)
  expect_equal(print(s), "http://localhost/")
})
