#' S4 method to visualize visualization objects
#'
#' A visualize method for \emph{visualization} objects. If \emph{object@localServer} is TRUE, then this
#' function will trigger a local instance of \pkg{servr} server.
#'
#' @param v visualization object
#' @return void
#' @examples
#'
#' v<- new("visualization")
#' #visualize(v)
#'
#' @export

setMethod("visualize",
          c(v = "visualization"),
          function(v) {

            if (v@visuServer@init == TRUE) {
              initServer(v@visuServer, force = FALSE)
            }

            if (v@viewServer@init == TRUE) {
              initServer(v@viewServer, force = FALSE)
            }

            if (v@dataServer@init == TRUE) {
              initServer(v@dataServer, force = FALSE)
            }

            utils::browseURL( print(v) )
          }
)
