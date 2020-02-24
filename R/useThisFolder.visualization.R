#' S4 method to use local folder to serve view and data for visualization objects (S4)
#'
#' A method that add the current folder to the server path. 
#' 
#' Maybe you are using a folder to store the inputs and outputs of your analysis. In this case, you may prefer to have the data (and the view, if you modify it) stored locally instead of filling the package folder with data.
#' The method `useThisFolder()` allows the user to create a symbolic link within the webserver root directory (pathToPackage/visu/) that points to the current folder.
#' 
#' @param v visualization object
#' @return void
#' @examples
#'
#' v<- new("visualization")
#' #useThisFolder(v)
#'
#' @export
#' @importFrom utils tail

setMethod("useThisFolder", c(v = "visualization"), 
  function(v) {
    folderPath = getwd() 
    
    packagePath <- path.package("hastaLaVista")
    
    folderName <- tail(strsplit(folderPath,"/")[[1]], n=1)
    
    to <- paste0(packagePath, "/visu/", folderName)
    
    # create dir if not existing
    if (!dir.exists(to)) {
      warning("windows user may have to run rstudio as administrator")
      
      switch(.Platform$OS.type,
             unix = file.symlink(from = folderPath, to = to),
             windows = shell(sprintf("mklink /D %s %s", 
                                     normalizePath(to, mustWork = FALSE),
                                     normalizePath(folderPath)
             ))
             )
      
      warning(paste("simlink created: ", to))
      
    } else {
      warning("repository already linked, no simlink created")      
    }
    
    # modify the parameters
    v@viewServer@path = paste0("/", folderName, "/view/")
    v@dataServer@path = paste0("/", folderName, "/data/")
    
    return(v)
  }
)
