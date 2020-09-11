
#' S4 method to visualize visualization objects (S4)
#'
#' A visualize method for \emph{visualization} objects. If \emph{object@localServer} is TRUE, then this
#' function will trigger a local instance of \pkg{servr} server.
#'
#' @param v visualization object
#' @param ... allows to pass translate = TRUE for running into docker instance
#' @return void
#' @examples
#'
#' v<- new("visualization")
#' #visualize(v)
#'
#' @export

setGeneric("visualize", function(v, ...) {
  standardGeneric("visualize")
})
