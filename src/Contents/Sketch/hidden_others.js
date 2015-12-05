@import 'libs/common.js'

var onRun = function(context){
    const selection = context.selection,
        doc = context.document,
        page = [doc currentPage],
        artboard = [page currentArtboard],
        g_layers = [artboard layers],
        MAX_COUNT = [selection count];

    if (MAX_COUNT > 0){
        processAllLayers(g_layers,function(layer){
            [layer setIsVisible:false];
        });
    }

    function processAllLayers(layers,callback) {
        for (var i = 0; i < [layers count]; i++) {
              var layer = [layers objectAtIndex:i];
              var isSkip = [selection indexOfObject:layer] < MAX_COUNT
              if (isGroup(layer)) {
                  if (isSkip) continue;
                  processAllLayers([layer layers], callback);
              }else{
                  if (!isSkip) callback(layer);
              }
        }
    }
}

