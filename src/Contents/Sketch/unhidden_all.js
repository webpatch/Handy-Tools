@import 'libs/common.js'

var onRun = function(context){
  const selection = context.selection,
      doc = context.document,
      page = [doc currentPage],
      artboard = [page currentArtboard],
      layers = [artboard layers];

  function processAllLayers(layers, callback) {
    for (var i = 0; i < [layers count]; i++) {
      var layer = [layers objectAtIndex:i];
      if (isMeasure(layer)) continue;
      if ([layer isMemberOfClass:[MSLayerGroup class]]) {
        callback(layer);
        processAllLayers([layer layers], callback);
      }
    else {
        callback(layer);
      }
    }
  }

  processAllLayers(layers,function(layer){
    if(![layer isVisible])[layer setIsVisible:true];
  })
}
