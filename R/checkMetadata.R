#' @title checkMetadata
#' @description
#' This function check and prepare a metadata dataframe to be used within hastaLaVista
#' framework. It may contain as much column as necessary, but should be of type 
#' data.frame and MUST contain at least one column with unique values. This column
#' should be named "sampleID". Thus each row of the metadata object describe one sample
#' @return a data.frame object
#' @examples
#' N <- 500
#' x <- rnorm(N, mean=0, sd=10)
#' y <- rnorm(N, mean=0, sd=10)
#' sampleID <- paste0("sampleID", seq_along(x))
#' sampleGroup <- paste0("sampleGroup", seq_along(x))
#' sampleColor <- c(rep(1,N/2), rep(2,N/2))
#' metadata <- data.frame(sampleID, sampleGroup, sampleColor)
#' checkMetadata(metadata)
#' @export

checkMetadata <- function(dataFrame, option = list()){
  
  if (!is.data.frame(dataFrame)) {
    stop("metadata should be a data.frame")
  }
  colNames <- colnames(dataFrame)
  
  if (!("sampleID" %in% colNames)) {
    warning("no column was found with column name sampleID, one was created")
    dataFrame["sampleID"] <- paste0("sampleID", seq_along(row.names(dataFrame)))
  } else {
    if (length(unique(dataFrame$sampleID)) < nrow(dataFrame)) {
      stop("a column sampleID was found, but its values are not unique")
    }
  }
  
  dataFrame[is.na(dataFrame)] <- "NA"
  return(dataFrame)
}