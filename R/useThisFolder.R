#' S4 method to use local folder to serve view and data for visualization objects (S4)
#'
#' A method that add the current folder to the server path. . 
#'
#' @param v visualization object
#' @return void
#' @examples
#'
#' v<- new("visualization")
#' #useThisFolder(v)
#'
#' @export

setGeneric("useThisFolder", function(v) {
  standardGeneric("useThisFolder")
})
