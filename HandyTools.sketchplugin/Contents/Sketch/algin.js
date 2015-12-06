@import 'libs/common.js'

var lastDir = getConfig('last_algin_dir');
lastDir = lastDir == null ? 1 : parseInt(lastDir);

function disableCell(cell)
{
	[cell setEnabled:false]
	[cell setTransparent:true]
}

function qq(cellArr,idxArr,call)
{
	for (var i= 0;i<idxArr.length;i++)
	{
		var idx = idxArr[i];
		call([cellArr objectAtIndex:idx],idx);
	}
}

function createAlert(msg, items, selectedItemIndex)
{
	selectedItemIndex = selectedItemIndex || 0;
	var viewBox = [[NSBox alloc] initWithFrame:NSMakeRect(0, 0, 0, 0)];
	[viewBox setTitle:""];
	[viewBox setTransparent:true];

	var prototype = [[NSButtonCell alloc] init];
	[prototype setBezelStyle:NSSmallIconButtonBezelStyle];
	[prototype setButtonType:NSPushOnPushOffButton];
	var myMatrix = [[NSMatrix alloc] initWithFrame:NSMakeRect(0, 0, 420, 90)
	  mode:NSRadioModeMatrix
	  prototype:prototype
	  numberOfRows:3
	  numberOfColumns:3];
	var cellArray = [myMatrix cells];
	[myMatrix setCellSize:CGSizeMake(40,30)];
	log("lastDir " +lastDir)
	[myMatrix selectCellAtRow:parseInt(lastDir/3) column:lastDir%3];

	qq(cellArray,[0,2],disableCell)
	var lables = ["","↑","","←","↓","→","—","|","╋"]
	qq(cellArray,[1,3,4,5,6,7,8],function(cell,idx){
	   [cell setTitle:lables[idx]];
	})
	[viewBox addSubview:myMatrix];

	[viewBox addSubview:createLabel("Key Object:",NSMakeRect(150,55,200,20))];

	var accessory = [[NSComboBox alloc] initWithFrame:NSMakeRect(150,25,250,25)];
	[accessory addItemsWithObjectValues:items];
	[accessory selectItemAtIndex:selectedItemIndex];
	[viewBox addSubview:accessory];

	[viewBox sizeToFit];

	var alert = [[NSAlert alloc] init];
	[alert setMessageText:msg];
	[alert addButtonWithTitle:"OK"];
	[alert addButtonWithTitle:"Cancel"];
	[alert setAccessoryView:viewBox];

	var responseCode = [alert runModal]
  	var sel = [accessory indexOfSelectedItem]
	var dir = [[myMatrix selectedCell] title].trim()
  	return [responseCode, sel,dir]
}

var fnObj = {
    "↑": {
        getKeyPosition: function(keyFrame) {
            keyCoordinate = CGRectGetMinY(keyFrame)
        },
        alignObj: function(frame,pRect) {
            [frame setMinY: keyCoordinate-pRect.y()]
        },
        position:1
    },
    "←": {
        getKeyPosition: function(keyFrame) {
            keyCoordinate = CGRectGetMinX(keyFrame)
        },
        alignObj: function(frame,pRect) {
            [frame setMinX: keyCoordinate-pRect.x()]
        },
        position:3
    },
    "↓": {
        getKeyPosition: function(keyFrame) {
            keyCoordinate = CGRectGetMaxY(keyFrame)
        },
        alignObj: function(frame,pRect) {
            [frame setMaxY: keyCoordinate-pRect.y()]
        },
        position:4
    },
    "→": {
        getKeyPosition: function(keyFrame) {
            keyCoordinate = CGRectGetMaxX(keyFrame)
        },
        alignObj: function(frame,pRect) {
            [frame setMaxX: keyCoordinate-pRect.x()]
        },
        position:5
    },
    "—": {
        getKeyPosition: function(keyFrame) {
            keyCoordinate = CGRectGetMidY(keyFrame)
        },
        alignObj: function(frame,pRect) {
            [frame setMidY: keyCoordinate -pRect.y()]
        },
        position:6
    },
    "|": {
        getKeyPosition: function(keyFrame) {
            keyCoordinate = CGRectGetMidX(keyFrame)
        },
        alignObj: function(frame,pRect) {
            [frame setMidX: keyCoordinate-pRect.x()]
        },
        position:7
    },
    "╋": {
        getKeyPosition: function(keyFrame) {
            keyCoordinateX = CGRectGetMidX(keyFrame)
            keyCoordinateY = CGRectGetMidY(keyFrame)
        },
        alignObj: function(frame,pRect) {
            [frame setMidX: keyCoordinateX-pRect.x()]
            [frame setMidY: keyCoordinateY-pRect.y()]
        },
        position:8
    }
}

function getSeletedLayersName(selection)
{
	var layers = [];
	for (var i=0; i < [selection count]; i++){
		layerName = selection[i].name();
		layers.push(layerName);
	}
	return layers;
}

var onRun = function (context){
    var doc = context.document;
    var selection = context.selection;

    if([selection count] < 2){
        [doc showMessage:"Please select 2 or more layers."]
    }else {
        var choice = createAlert('Align relative to', getSeletedLayersName(selection), 0);
        if (choice[0] == 1000)
        {
            var direction = choice[2],
                getKeyPosition = fnObj[direction].getKeyPosition,
                alignObj = fnObj[direction].alignObj,
                index = choice[1],
                keyLayer = [selection objectAtIndex:index],
                //keyFrame = [keyLayer frame];
                keyFrame = absRect2CGRect([keyLayer absoluteRect]);
            getKeyPosition(keyFrame)
            for (var i=0; i < [selection count]; i++){
                layer = [selection objectAtIndex:i]
                var parentRect = [[layer parentGroup] absoluteRect];
                frame = [layer frame]
                alignObj(frame,parentRect)
            }

            setConfig('last_algin_dir',fnObj[direction].position);
        }
    }
};

