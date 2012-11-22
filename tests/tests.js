

function paddingHelper(position) {
	return parseInt(self.$elem.css("padding-" + position), 10);
}

$(function () {
	
	console.log(window.osh_testing);
	
	var exposedClasses = window.osh_testing;
	// we want to test the steps advanced offset calculation so create a step
	
	
	// and configure the div element for testing
	
	$elem = $("<div id='padding-test' />").appendTo("body");
	$elem.css({
		"padding-top" : 10,
		"padding-right" : 20,
		"padding-bottom" : 30,
		"padding-left" : 40,
		"margin" : 50,
		"border" : "1px solid black"
	})
	.text("padding: 10 20 30 40");
	
	//create our tutorial step
	var step = new exposedClasses.Step("#padding-test");
	
	// 1
	test("offset top, respect top padding", function () {
		step.padding = "top";
		var expected = $elem.offset().top + paddingHelper("top");
		
		var actual = step.offsetTop();
		equal(actual, expected);
	});
	
	// 2
	test("offset top, no respect top padding", function () {
		step.padding = "none";
		var expected = $elem.offset().top;
		
		var actual = step.offsetTop();
		equal(actual, expected);
	});
	
	// 3
	test("offset left, respect left padding", function () {
		step.padding = "left";
		var expected = $elem.offset().left + paddingHelper("left");
		
		var actual = step.offsetLeft();
		equal(actual, expected);
	});
	
	//4
	test("offset left, no respect left padding", function () {
		step.padding = "top right bottom";
		var expected = $elem.offset().left;
		
		var actual = step.offsetLeft();
		equal(actual, expected);
	});
	
	// 5
	test("offset right, respect left and right padding", function () {
		step.padding = "left right";
		
		var expected = step.$elem.offset().left + paddingHelper("left");
		expected += $elem.width();
		
		var actual = step.offsetRight();
		equal(actual, expected);
	});
	
	// 6
	test("offset right, no respect left padding, respect right padding", function () {
		step.padding = "right";
		
		var expected = step.$elem.offset().left + paddingHelper("left");
		expected += $elem.width();
		
		var actual = step.offsetRight();
		equal(actual, expected);
	});
	
	// 7
	test("offset right, respect left padding, no respect right padding", function () {
		step.padding = "left";
		
		var expected = step.$elem.offset().left + paddingHelper("left");
		expected += $elem.width() + paddingHelper("right");
		
		var actual = step.offsetRight();
		equal(actual, expected);
	});
	
	test("offset bottom, respect top padding, no respect bottom padding", function () {
		step.padding = "top";
		
		var expected = step.$elem.offset().top + paddingHelper("top");
		expected += $elem.height() + paddingHelper("bottom");
		
		var actual = step.offsetBottom();
		equal(actual, expected);
	});
	
	test("offset bottom, no respect top padding, repsect bottom padding", function () {
		step.padding = "bottom";
		
		var expected = step.$elem.offset().top + paddingHelper("top");
		expected += $elem.height();
		
		var actual = step.offsetBottom();
		equal(actual, expected);
	});
	
	test("absolute height, repsecting top padding and bottom padding",	function () {
		step.padding = "top bottom";
		
		var expected = step.$elem.height();
		var actual = step.absHeight();
		
		equal(actual, expected);
		
	});
	
	test("absolute height, repsecting no padding",	function () {
		step.padding = "none";
		
		var expected = step.$elem.height() + paddingHelper("top") +  paddingHelper("bottom");
		var actual = step.absHeight();
		
		equal(actual, expected);
		
	});
	
	test("absolute height, repsecting bottom padding",	function () {
		step.padding = "bottom";
		
		var expected = step.$elem.height() + paddingHelper("top");
		var actual = step.absHeight();
		
		equal(actual, expected);
		
	});
	
	test("absolute width, repsecting left and right padding",	function () {
		step.padding = "left right";
		
		var expected = step.$elem.width();
		var actual = step.absWidth();
		
		equal(actual, expected);
		
	});
});
