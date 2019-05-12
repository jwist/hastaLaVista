
#' repeat a row when needed to match other matrix dimension
#'
#' @param v a vector to be repeated
#' @param n number ot time to repeat the vector
#' @return a matrix
#' @references the original function was found here: \url{https://www.r-bloggers.com/a-quick-way-to-do-row-repeat-and-col-repeat-rep-row-rep-col/}
#' @examples
#'
#' repRow(c(1,2,3), 2)
#' @export

repRow <- function(v, n){

  matrix( rep(v, each = n), nrow = n )

}
