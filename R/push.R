

#' Pushes new view.json or data.json to the visualization server
#'
#' @param visualization the visualization to be updated
#' @param type the type of file to be update, view or data
#' @param list the list object that contains the view or data
#' @return an updated visualization object and new data/view.json on the server
#' @examples
#'
#' x <- seq(from = 0, to = pi, by = 0.1)
#'
#' #simple array
#' d <- appendData(variableName = "simpleArray", variable = cos(x), type = "1D Y array")
#' d <- appendData(data = d, variableName = "simpleArray2", variable = sin(x), type = "1D Y array")
#' v <- new("visualization")
#' push(v, type="data", d)
#'
#' @seealso \pkg{visualizeR::saveJSON()}
#' @export

push <- function(visualization, type, list) {

  switch (type,
          "view" = {

            path <- paste0(visualization@viewServer@rootDir,
                           visualization@viewServer@path)
            filename <- visualization@view

          },
          "data" = {

            path <- paste0(visualization@dataServer@rootDir,
                           visualization@dataServer@path)
            filename <- visualization@data

          }
  )

  visualizeR::saveJSON(list, path, filename)

}
