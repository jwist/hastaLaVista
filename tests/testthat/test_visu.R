context("testing visualization")


test_that("visu", {
   expect_warning(visu("https://my.cheminfo.org",
      "https://gist.githubusercontent.com/jwist/57512dc74595a7c2b66c3e2bf4e76ba1/raw/test.view.json",
      "https://gist.githubusercontent.com/jwist/3354274a2b1762e408af22a8217384d9/raw/data.json"), "my.cheminfo.org")

})

test_that("print.visualization.R", {
  v <- new("visualization")
  expect_output(str(print(v)), "http")
  expect_output(str(print(v)), "5474")
  expect_output(str(print(v)), "localhost")
})
