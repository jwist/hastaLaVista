readBruker('/home/jul/git/visualizeR_root/visualizerExamples/bariatric/BariatricBruker')
metadata <- read.csv2('/home/jul/git/visualizeR_root/visualizerExamples/bariatric/Bariatric_RAT_meta.csv', header = TRUE, sep = ',')

idx=metadata$'Experiment.Number' %in% rownames(X)
metadata=metadata[idx,]

idx=rownames(X) %in% metadata$'Experiment.Number'
X=X[idx,]
meta=meta[idx,]

metadata <- cbind(metadata, meta)

idx=c(get.idx(c(min(ppm), 0.5), ppm),
      get.idx(c(4.5, 6.5), ppm),
      get.idx(c(9.5, max(ppm)), ppm))
X=X[,-idx]
ppm=ppm[-idx]
