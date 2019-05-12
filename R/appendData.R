
#' @title append new data to data list
#' @description
#' This function allows to create, append data to be passed to the https://github.com/npellet/visualizer.
#' Prior to this, the list have to be parsed and stored as a json file. This file can be either stored locally
#' or stored on https://gist.github.com.
#'
#' @param data data, if it exists
#' @param variable new dataset
#' @param variableName name of the dataset. The name of the data must be exposed to the https://github.com/npellet/visualizer
#' using the exposeData.R function.
#' @param type type of the data. The types currently supported are
#' \itemize{
#' \item "1D Y array"
#' \item "1D XY array"
#' \item "table"
#' \item "chart"
#' \item"multiChart"
#' \item"score"
#' \item"color"
#' }
#' @return a list object with the data
#' @examples
#' x <- seq(from = 0, to = pi, by = 0.1)
#'
#' #simple array
#' d <- appendData(variableName = "simpleArray", variable = cos(x), type = "1D Y array")
#' d <- appendData(data = d, variableName = "simpleArray2", variable = sin(x), type = "1D Y array")
#'
#' #XY array
#' xy = data.frame( x = x, y = sin(x) )
#' d <- appendData(data = d, variableName = "simpleArray3", variable = xy, type = "1D XY array")
#'
#' #chart
#' chart <- data.frame("x" = x,
#'                     "y" = cos(3*x),
#'                     "highlight" = seq_along(x) - 1,
#'                     "info"= paste0("ID: ", 0:31)
#'                     )
#'
#' d <- appendData(data = d, variableName = "chart", variable = chart, type = "chart")
#'
#' opts = list(
#' "trackMouseLabelRouding" = 1,
#' "trackMouse" = "false",
#' "lineToZero" = "false",
#' "trackMouseLabel" = "false",
#' "lineColor" = "red",
#' "autoPeakPickingNb" = 4,
#' "markers" = list(
#'   "fillColor" = "transparent",
#'   "zoom" = 1,
#'   "show" = "false",
#'   "type" = 1,
#'   "strokeColor" = "false",
#'   "strokeWidth" = 1
#' ),
#' "lineStyle" = 1,
#' "autoPeakPickingMinDistance" = 10,
#' "label" = "",
#' "autoPeakPicking" = "false",
#' "flip" = "false"
#' )
#'
#' chart1 <- data.frame("x" = x,
#'                      "y" = cos(3*x),
#'                      "highlight" = seq_along(x) - 1,
#'                      "info"= paste0("cosID: ", 0:31)
#'                      )
#'
#' chart2 <- data.frame("x" = x,
#'                      "y" = sin(3*x),
#'                      "highlight" = seq_along(x) - 1,
#'                      "info"= paste0("sinID: ", 0:31)
#'                      )
#'
#' chart = list( list(chart=chart1, options=opts), list(chart=chart2, options=opts))
#' d <- appendData( data = d, variableName = "multiChart", variable = chart, type = "multiChart")
#'
#' @export

appendData <- function(data, variable, variableName, type) {
  if (missing(data)) {
    data <- list()
  }

  switch (type,
          "1D Y array" = {
            data[[variableName]] <- variable
          },
          "1D XY array" = {
            data[[variableName]] <- c(rbind(variable$x, variable$y))
          },
          "table" = {
            data[[variableName]] <- variable
          },
          "chart" = {
            data[[variableName]] <- list(type = jsonlite::unbox("chart"),
                                         value = list(
                                           title = jsonlite::unbox("a visualization title"),
                                           data = list(list(
                                             info = mapply(
                                               function(x, y)
                                                 list(
                                                   id = jsonlite::unbox(as.character(x)),
                                                   "_highlight" = list(y)
                                                 ),
                                               variable$info,
                                               variable$highlight,
                                               SIMPLIFY = FALSE
                                             ),
                                             x = variable$x,
                                             y = variable$y,
                                             style = list(
                                               selected = mapply(
                                                 function(x, y)
                                                   list(
                                                     fill = "black",
                                                     shape = "circle",
                                                     cx = 0,
                                                     cy = 0,
                                                     r = 3,
                                                     height = "5px",
                                                     width = "5px",
                                                     stroke = "transparent"
                                                   ),
                                                 variable$info,
                                                 variable$highlight,
                                                 SIMPLIFY = FALSE
                                               ),
                                               unselected = mapply(
                                                 function(x, y)
                                                   list(
                                                     fill = "black",
                                                     shape = "circle",
                                                     cx = 0,
                                                     cy = 0,
                                                     r = 3,
                                                     height = "5px",
                                                     width = "5px",
                                                     stroke = "transparent"
                                                   ),
                                                 variable$info,
                                                 variable$highlight,
                                                 SIMPLIFY = FALSE
                                               )
                                             )
                                           ))
                                         ))
          },
          "multiChart" = {
            data[[variableName]] <- list(type = jsonlite::unbox("chart"),
                                         value = list(
                                           title = jsonlite::unbox("a visualization title"),
                                           axis = list("0" = list(type = "bottom", name = "Bottom axis"),
                                                       "1" = list(type = "left", name = "Left axis"),
                                                       "2" = list(type = "right", name = "Right axis")
                                                       ),
                                           data = lapply( variable, function (x) list(
                                             xAxis = 0,
                                             yAxis = 1,
                                             info = mapply(
                                               function(x, y)
                                                 list(
                                                   id = jsonlite::unbox(as.character(x)),
                                                   "_highlight" = list(y)
                                                 ),
                                               x$chart$info,
                                               x$chart$highlight,
                                               SIMPLIFY = FALSE
                                             ),
                                             x = x$chart$x,
                                             y = x$chart$y,
                                             "_highlight" = x$chart$highlight,
                                             #"options" = x$options,
                                             #if ( missing( variable$selected ) && missing( variable$unselected )) {
                                               style = list(
                                                 selected = mapply(
                                                   function(x, y)
                                                     list(
                                                       fill = "black",
                                                       shape = "circle",
                                                       cx = 0,
                                                       cy = 0,
                                                       r = 3,
                                                       height = "5px",
                                                       width = "5px",
                                                       stroke = "transparent"
                                                       ),
                                                   x$chart$info,
                                                   x$chart$highlight,
                                                   SIMPLIFY = FALSE
                                                 ),
                                                 unselected = mapply(
                                                   function(x, y)
                                                     list(
                                                       fill = "black",
                                                       shape = "circle",
                                                       cx = 0,
                                                       cy = 0,
                                                       r = 3,
                                                       height = "5px",
                                                       width = "5px",
                                                       stroke = "transparent"
                                                     ),
                                                   x$chart$info,
                                                   x$chart$highlight,
                                                   SIMPLIFY = FALSE
                                                 )
                                               )
                                             #}
                                             )
                                           )
                                         ))
          },
          "score" = {
            data[[variableName]] <- list(
                                           title = jsonlite::unbox("score plot"),
                                           data = list(list(
                                             type = jsonlite::unbox("scatter"),
                                             info = mapply(
                                               function(x, y)
                                                 list(
                                                   id = jsonlite::unbox(as.character(x)),
                                                   "_highlight" = list(y)
                                                 ),
                                               variable$info,
                                               variable$highlight,
                                               SIMPLIFY = FALSE
                                             ),
                                             x = variable$x,
                                             y = variable$y,
                                             styles = list(
                                               unselected = mapply(
                                                 function(x, y)
                                                   list(
                                                     fill = x,
                                                     shape = "circle",
                                                     cx = 0,
                                                     cy = 0,
                                                     r = 3,
                                                     height = "5px",
                                                     width = "5px",
                                                     stroke = "transparent"
                                                   ),
                                                 variable$color,
                                                 variable$highlight,
                                                 SIMPLIFY = FALSE
                                                ),
                                               selected = mapply(
                                                 function(x, y)
                                                   list(
                                                     fill = x,
                                                     shape = "circle",
                                                     cx = 0,
                                                     cy = 0,
                                                     r = 8,
                                                     height = "5px",
                                                     width = "5px",
                                                     stroke = "transparent"
                                                   ),
                                                 variable$color,
                                                 variable$highlight,
                                                 SIMPLIFY = FALSE
                                               )
                                             )
                                           ))
                                         )
          },
          "color" = {
            data[[variableName]] <- list(
              title = jsonlite::unbox("color plot"),
              data = list(list(
                type = jsonlite::unbox("color"),
                x = variable$x,
                y = variable$y,
                color = variable$color
              ))
            )
          })

  return(data)
}
