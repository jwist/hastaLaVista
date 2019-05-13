
#' Converts the list objects into json files
#'
#' This function creates a JSON file from a list object using \pkg{jsonlite::toJSON()} function.
#' It also create a time versioned of the file to ensure the data are not overwritten by the
#' \pkg{hastaLaVista::push()} function.
#'
#' @param object the view list object to be saved
#' @param path the path to file
#' @param filename the name of the file
#' @return a json file to be passed to the https://github.com/npellet/visualizer
#' @examples
#'
#' v <- list()
#' saveJSON(v, "~/", "view.json")
#'
#' @seealso \pkg{hastaLaVista::push()}
#' @export

saveJSON <- function( object, path, filename ) {

  version <- gsub(":", "-", gsub(" ", "_", base::Sys.time()))

  if (regexpr("/$", path)[1] == -1) {
    path <- paste0(path, "/")
    warning("saveJSON: the path argument should have a trailing slash, one was added")
  }

  pathToFile <- paste0(path, filename)

  fileConn <- file( pathToFile )

  writeLines(jsonlite::toJSON(object,
                    pretty = TRUE,
                    auto_unbox = TRUE,
                    null = "null"
                    ),
             fileConn
             )

  base::file.copy(pathToFile, paste0(path, version, "_", filename))

  close( fileConn )

}
