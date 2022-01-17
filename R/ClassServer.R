#' An S4 class for server
#'
#' @slot baseURL the url or IP of the server
#' @slot port the port to which the server listen
#' @slot path the path relative to the server root directory
#' @slot protocole a protocole
#' @slot rootDir root directory where to install the visualizer application
#' @slot init if TRUE an instance of \pkg{servr::httw()} will be started to serve the files
#' @return an url object
#' @examples
#'
#' new("server")
#'
#' @export

setClass("server",
         slots = list(baseURL = "character",
                      port = "numeric",
                      path = "character",
                      protocole = "character",
                      rootDir = "character",
                      init = "logical"),
         prototype = list( baseURL = "localhost",
                           port = 5474,
                           path = "/",
                           protocole = "http://",
                           rootDir = file.path( system.file(package = "hastaLaVista"), "visu" ),
                           init = TRUE)

)
