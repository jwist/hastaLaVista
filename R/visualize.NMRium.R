#' Method for exporting spectra information into the NMRium format. You can use this to export simple x, re and x, re and im spectra
#' If you provide a list containing NMRium data, it will append the new spectra data into the proper place, 
#' so that you can get an overlay of several spectra into the platform. 
#'
#' @param x Independent variable
#' @param yr Real dependent variable
#' @param yi (optional)Imaginary dependent variable
#' @param output Object containing other NMRium data
#' @param observeFrequency Observe frequency in MHz
#' @param dataTypeData Data type format. Use 'NMR FID' if the spectrum is in the time domain (Default 'NMR SPECTRUM')
#' @param solvent String that specify the solvent. (Default 'UNKNOWN') 
#' @param nucleus Observe nucleus.  (Default '1H') 
#' @param PHC0 Phase 0 correction value (Optional, Default 0)
#' @param PHC1 Phase 1 correction value (Optional, Default 0)
#' @param col Color for this spectrum(Default black)

#' @return list
#' @examples
#'
#' nmrium <- exportReIm(ppm, Y[1,], NULL, output=NA, observeFrequency=600, dataType='NMR SPECTRUM', solvent='UNKNOWN', nucleus='1H', PHC0=0, PHC1=0, col='#AA0109')
#' nmrium <- exportReIm(ppm, Y[2,], NULL, output=nmrium, observeFrequency=600, dataType='NMR SPECTRUM', solvent='UNKNOWN', nucleus='1H', PHC0=0, PHC1=0, col='#0000FF')
#' nmrium <- exportReIm(ppm, Y[3,], NULL, output=nmrium, observeFrequency=600, dataType='NMR SPECTRUM', solvent='UNKNOWN', nucleus='1H', PHC0=0, PHC1=0, col='#FFFF00')
#' nmrium <- exportReIm(ppm, Y[4,], NULL, output=nmrium, observeFrequency=600, dataType='NMR SPECTRUM', solvent='UNKNOWN', nucleus='1H', PHC0=0, PHC1=0, col='#00AA00')
#' 
#' write(toJSON(nmrium, pretty = TRUE, auto_unbox = TRUE, digits = 12), file='export.nmrium')
#'
#' @export
exportReIm <- function(x, yr, yi, output=NA, observeFrequency=600, dataType='NMR SPECTRUM', solvent='UNKNOWN', nucleus='1H', PHC0=0, PHC1=0, col='#000000') {
  meta <- list("TITLE"="spectra-data from ReIm",
               "JCAMPDX"="5.00 $$Cheminfo tools 3.4.11",
               "OWNER"="",
               "DATATYPE"="NMR SPECTRUM",
               "DATACLASS"="XYDATA",
               "OBSERVEFREQUENCY"=observeFrequency,
               ".OBSERVENUCLEUS"= nucleus,
               ".SOLVENTNAME"=solvent,
               "XUNITS"="PPM",
               "YUNITS"="Intensity",
               "NPOINTS"=length(x),
               "FIRSTX"=x[[1]],
               "LASTX"=x[[length(x)]],
               "FIRSTY"=yr[[1]],
               "LASTY"=yr[[length(yr)]],
               "XFACTOR"=(x[[length(x)]] - x[[1]]) / (length(x) - 1),
               "YFACTOR"=1,
               "MAXY"=max(yr),
               "MINY"=min(yr),
               "DELTAX"=(x[[length(x)]] - x[[1]]) / (length(x) - 1),
               "DECIM"=0,
               "DSPFVS"=0,
               "FCOR"=0,
               "SW_h"=(x[[length(x)]] - x[[1]]) * observeFrequency,
               "SW"=(x[[length(x)]] - x[[1]]),
               "TD"=length(x),
               "DSPFVS"=0,
               "BF1"=0,
               "SFO1"=observeFrequency,
               "NUC1"=paste0("<",nucleus,">"),
               "PHC0"=PHC0,
               "PHC1"=PHC1)
  info <- list("nucleus"= nucleus,
               "isFid"=FALSE,
               "isComplex"=TRUE,
               "dimension"=1,
               "name"="",
               "isFt"=TRUE,
               "experiment"="",
               "fnMode"="undefined",
               "title"="spectra-data from ReIm",
               "solvent"=solvent,
               "type"="NMR SPECTRUM",
               "dataClass"="XYDATA",
               "firstX"=x[[1]],
               "lastX"=x[[length(x)]],
               "numberOfPoints"=length(x),
               "originFrequency"=observeFrequency,
               "baseFrequency"=0,
               "fieldStrength"=0,
               "spectralWidth"=(x[[length(x)]] - x[[1]]),
               "acquisitionTime"=length(x)/(2*observeFrequency*(x[[length(x)]] - x[[1]])),
               "groupDelay"=0,
               "DECIM"=0,
               "DSPFVS"=0,
               "increment"=(x[[length(x)]] - x[[1]]) / (length(x) - 1),
               "frequencyOffset"=observeFrequency*1e6,              
               "PHC0"=PHC0,
               "PHC1"=PHC1)
  data <- list("x"=x, "re"=yr, "im"=yi)
  display <- list("color"=col, "isPeaksMarkersVisible"=TRUE, "isRealSpectrumVisible"=TRUE,"isVisible"=TRUE, "isVisibleInDomain"=TRUE)
  
  if(all(is.na(output))) {
    return (list("version"=4, "data"=list("spectra"=list(list("data"=data, "meta"=meta, "info"=info, "display"=display)))))
  } else {
    output[["data"]][["spectra"]] <- append(output[["data"]][["spectra"]], list(list("data"=data, "meta"=meta, "info"=info, "display"=display)))
    return(output)
  }
}