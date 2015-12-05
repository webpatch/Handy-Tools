// const page = [doc currentPage],
//       artboard = [page currentArtboard],
//       artboards = [doc artboards],
//       selection = context.selection,
//       doc = context.document,
//       current = artboard ? artboard : page,
const prefix = 'kiny',
    measureRegEx = /\$SIZE|\$WIDTH|\$HEIGHT|\$DISTANCE|\$PROPERTY|\$LABEL|\$OVERLAYER|\$COORDINATE/;




function isMeasure(layer)
{
  return measureRegEx.exec([layer name]);
}

function is(layer, theClass){
  var cls = [layer class];
  return cls === theClass;
}

function isPage(layer){
  return is(layer, MSPage);
}

function isGroup(layer){
  return is(layer, MSLayerGroup);
}

function isText(layer){
  return is(layer, MSTextLayer);
}

function isShape(layer){
  return is(layer, MSShapeGroup);
}

function getConfig(key) {
  var defaults = [NSUserDefaults standardUserDefaults];
  return [defaults objectForKey: '-' + prefix + '-' + key];
}

function setConfig(key, value) {
  var defaults = [NSUserDefaults standardUserDefaults],
      configs  = [NSMutableDictionary dictionary];
  [configs setObject: value forKey: '-' + prefix + '-' + key]
  return [defaults registerDefaults: configs];
}

function toJSArray(arr) {
  var len = [arr count],
      res = [];
  while(len--){
    res.push(arr[len]);
  }
  return res;
}

function createLabel(text, frame ,editable) {
	editable = editable || false;
	var label = [[NSTextField alloc] initWithFrame:frame];
	[label setStringValue:text];
	[label setFont:[NSFont boldSystemFontOfSize:12]];
	[label setBezeled:false];
	[label setDrawsBackground:editable];
	[label setEditable:editable];
	[label setSelectable:editable];
	return label;
}