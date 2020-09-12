
#' S3 method to print server objects (S4)
#'
#' A print method for \emph{serverURL} objects
#'
#' @param x server object
#' @param ... parameters of the print generic method
#' @return a string of character, a URL
#' @examples
#'
#' s <- new("server")
#' print(s)
#'
#' @export
#' @importFrom methods hasArg

print.server <- function(x, ...){
  if (x@port == 0) {
    url <- paste0(x@protocole, x@baseURL, x@path)
  } else {
    url <- paste0(x@protocole, x@baseURL, ":", x@port, x@path)
  }
  if (hasArg(translate)) {
    if (list(...)$translate == TRUE){
      url <- rstudioapi::translateLocalUrl(url, absolute = TRUE) 
    }
  }
  return(url)
}
