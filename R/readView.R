
#' Read json objects from https://github.com/npellet/visualizer.
#'
#' @param pathToFile the path to file
#' @return a list object to be manipulated
#' @examples
#' path <- file.path( system.file(package = "visualizeR"), "visu", "view", "blank.view.json" )
#' v <- readView( path )
#' @export

readView <- function( pathToFile ) {

  lines <- readLines( pathToFile )

  jsonlite::fromJSON(lines,
                simplifyVector = FALSE,
                simplifyDataFrame = FALSE,
                simplifyMatrix = FALSE
                )

}
