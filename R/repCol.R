
#' repeat a column when needed to match other matrix dimension
#'
#' @param c a vector to be repeated
#' @param n number ot time to repeat the vector
#' @return a matrix
#' @references the original function was found here: \url{https://www.r-bloggers.com/a-quick-way-to-do-row-repeat-and-col-repeat-rep-row-rep-col/}
#' @examples
#'
#' repCol(c(1,2,3), 2)
#' @export

repCol <- function(c, n){

  matrix( rep(c, each = n), ncol = n, byrow = TRUE )

}
