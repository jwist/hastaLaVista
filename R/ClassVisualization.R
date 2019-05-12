#' An S4 class that contains a visualization
#'
#' @slot visuServer server object that defines how to serve the \emph{github.com/npellet/visualizer} tool
#' @slot viewServer server object that defines how to serve local view.json
#' @slot dataServer server object that defines how to serve local data.json
#' @slot data name of data json file
#' @slot view name of view json file
#' @return a visualization object
#' @examples
#'
#' new("visualization")
#'
#' @export

setClass("visualization",
         slots = list(visuServer = "server",
                      viewServer = "server",
                      dataServer = "server",
                      data = "character",
                      view = "character"),
         prototype = list(visuServer = new("server"),
                          viewServer = new("server", path = "/view/", init = FALSE),
                          dataServer = new("server", path = "/data/", init = FALSE),
                          data = "data.json",
                          view = "view.json")

)
