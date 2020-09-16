#' @title start a websocket server
#' @description
#' This function established a two way connection between R and the visualizer
#' using a websocket
#' @param port port if not default
#' @return a connection
#' @examples
#' # conn <- startWSServer()
#' @export

startWSServer <- function(port){
  httpuv::stopAllServers()
  cat("Starting server on port 7356 \n")
  s <- httpuv::startServer("0.0.0.0", 7356,
                           list(
                             onHeaders = function(req) {
                               # Print connection headers
                               cat(capture.output(str(as.list(req))), sep = "\n")
                             },
                             onWSOpen = function(ws) {
                               cat("Connection opened.\n")
                               ws$onMessage(function(binary, message) {
                                 cat("Server received message:", message, "\n")
                                 ws$send('r got your message')
                                 assign("from", fromJSON(message), envir=.GlobalEnv)
                                 assign("conn", ws, envir=.GlobalEnv)
                                 if (from$message[1] == "hlv is connected"){
                                   ws$send(toJSON(init))
                                   cat("init data sent")
                                 }
                               })
                               ws$onClose(function() {
                                 cat("Connection closed.\n")
                               })
                             }
                           )
  )
}