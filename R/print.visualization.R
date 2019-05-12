#' S3 method to print visualization objects (S4)
#'
#' A print method for \emph{visualization} objects
#'
#' @param x visualization object
#'@param ... parameters of the print generic method
#' @return a string of character, a URL
#' @examples
#'
#' v <- new("visualization")
#' print(v)
#'
#' @export

print.visualization <- function(x, ...){
  paste0(print(x@visuServer),
         "?viewURL=",
         print(x@viewServer),
         x@view,
         "&dataURL=",
         print(x@dataServer),
         x@data)
}

# setMethod("print",
#           signature(x = "visualization"),
#           function(x, ...){
#             paste0(show(x@visuURL),
#                    "?viewURL=",
#                    show(x@viewURL),
#                    x@view,
#                    "&dataURL=",
#                    show(x@dataURL),
#                    x@data)
#           })
