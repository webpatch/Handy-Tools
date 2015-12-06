@import 'libs/common.js'

var lastDir = getConfig('last_spacing_dir');
lastDir = lastDir == null ? 1 : parseInt(lastDir)

function createAlert(msg)
{
	var viewBox = [[NSView alloc] initWithFrame:NSMakeRect(0, 0, 320, 40)];
	[viewBox addSubview:createLabel("Direction:",NSMakeRect(0, 1, 70, 25),false)];

	var prototype = [[NSButtonCell alloc] init];
	[prototype setBezelStyle: NSRegularSquareBezelStyle];
	[prototype setButtonType:NSPushOnPushOffButton];
	var myMatrix = [[NSMatrix alloc] initWithFrame:NSMakeRect(65, 0, 260, 35)
	  mode:NSRadioModeMatrix
	  prototype:prototype
	  numberOfRows:1
	  numberOfColumns:2];
	var cellArray = [myMatrix cells];
	[myMatrix setCellSize:CGSizeMake(40,35)];
	[myMatrix selectCellAtRow:0 column:lastDir];
	[[cellArray objectAtIndex:0] setTitle:"⬌"];
	[[cellArray objectAtIndex:1] setTitle:"⬍"];
	[viewBox addSubview:myMatrix];

	[viewBox addSubview:createLabel("Spacing:",NSMakeRect(160, 1, 60, 25),false)];
	
	var input = createLabel("10",NSMakeRect(225, 6, 90, 22),true);
	[input setFont:[NSFont systemFontOfSize:17]];
	[viewBox addSubview:input];

	var alert = [[NSAlert alloc] init];
	[alert setMessageText:msg];
	[alert addButtonWithTitle:"OK"];
	[alert addButtonWithTitle:"Cancel"];
	[alert setAccessoryView:viewBox];

	var responseCode = [alert runModal];
  	var sel = [input integerValue];
	var dir = [[myMatrix selectedCell] title].trim();
  	return [responseCode, sel,dir];
}

function sort_by_position_left(a,b){
  return [[a absoluteRect] x] - [[b absoluteRect] x];
}

function sort_by_position_top(a,b){
  return [[a absoluteRect] y] - [[b absoluteRect] y];
}

function horizontalSpacing(spacing,selection)
{
	var sorted_selection = toJSArray(selection).sort(sort_by_position_left),
	    first_element = sorted_selection[0],
	    left_position = [[first_element absoluteRect] x];

	sorted_selection.forEach(function(layer){
        var parentRect = [[layer parentGroup] absoluteRect];
        [[layer frame] setX:left_position-parentRect.x()];
        var f = [layer absoluteRect]
        left_position = f.x() + f.width() + spacing;
	});
}

function verticallSpacing(spacing,selection)
{
	var sorted_selection = toJSArray(selection).sort(sort_by_position_top),
	    first_element = sorted_selection[0],
	    top_position = [[first_element absoluteRect] y];

	sorted_selection.forEach(function(layer){
        var parentRect = [[layer parentGroup] absoluteRect];
	    [[layer frame] setY:top_position-parentRect.y()];
        var f = [layer absoluteRect]
	    top_position = f.y() + f.height() + spacing;
	});
}

var onRun = function(context) {
	var doc = context.document;
  	var selection = context.selection;

	if([selection count] < 2){
  		[doc showMessage:"Please select 2 or more layers."];
	}else {
		var choice = createAlert("Layers Spacing");
		if (choice[0] == 1000)
		{
			var spacing = choice[1];
		  	switch(choice[2]){
				case "⬌":
					horizontalSpacing(spacing,selection);
					setConfig('last_spacing_dir',0);
					break;
				case "⬍":
					verticallSpacing(spacing,selection);
					setConfig('last_spacing_dir',1);
					break;
			}
		}
	}
}
