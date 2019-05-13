
context("testing jsonlite behavior")


 test_that("blank and test view exists", {
   path1 <- file.path( system.file(package = "hastaLaVista"), "visu", "view", "blank.view.json" )
   path2 <- file.path( system.file(package = "hastaLaVista"), "visu", "view", "test.view.json" )
   expect_true(system(paste("ls", path1)) == 0)
   expect_true(system(paste("ls", path2)) == 0)
 })

test_that("data integrity", {
  path1 <- file.path( system.file(package = "hastaLaVista"), "visu", "view", "blank.view.json" )
  v <- readView(path1)
  expect_that(length(v), equals(6))
  expect_that(v[[1]], equals("2.93.0"))
})

test_that("import export with jsonlite", {
  path1 <- file.path( system.file(package = "hastaLaVista"), "visu", "view", "test.view.json" )
  v <- readView(path1)
  saveJSON(v, "../../../", "TestThat.json")
  expect_true(system(paste("diff ../../../TestThat.json", path1)) == 0)
  expect_is(v$variables[[1]]$jpath, "list")
  expect_warning(saveJSON(v, "../../..", "TestThat.json"), "trailing")
})
