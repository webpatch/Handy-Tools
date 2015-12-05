@import 'libs/common.js'

var onRun = function(context){
    const doc = context.document,
      artboards = [doc artboards];

    function processAllLayers(layers, callback) {
        for (var i = 0; i < [layers count]; i++) {
          var layer = [layers objectAtIndex:i];
          if (isMeasure(layer)) continue;
          if ([layer isMemberOfClass:[MSLayerGroup class]]) {
                callback(layer);
                processAllLayers([layer layers], callback);
          }else {
                callback(layer);
          }
        }
    }

    for (var j = 0; j < [artboards count]; j++){
      var artboard = [artboards objectAtIndex:j];
      var layers = [artboard layers];
      processAllLayers(layers,function(layer){
          if(![layer isVisible]) [layer setIsVisible:true];
      })
    }
}

