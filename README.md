jQuery.on-screen-help
==============

A jQuery tutorial plugin for any web page.

 **Demo:**
[http://epstone.github.com/on-screen-help/demo/](http://epstone.github.com/on-screen-help/demo/ "DEMO")
#Installation
Include script *after* the jQuery library and add the stylesheet

    <script src="/path/to/jquery.on-screen-help.js"></script> 
	<link rel="stylesheet" type="text/css" href="/path/to/jquery.on-screen-help.css" />
	
#Usage

    $("body").onScreenHelp(
	[
		{	
			// required step settings -->
			selector : "#preamble", // [string] selector for element to be highlighted
			description : "Speech bubble text", // [string] text for description box, you can also use html setting instead
			
			// optional step settings -->
			caption: "Some Label", // [string] caption for clickable zone
			navCaption: "Navigation button caption", // [string] if not provided auto-numbered
			html : "<div> use either description or html</div>", // [string] html for description box
			padding: "all", // [string] Respect padding: "none" (default), "all", or a combination of top, right, bottom, left
			position: "bottom", // [string] position of the speech bubble. top, left, bottom or right
			startWith: true, // [boolean] this should be the step to start with
			scrollTo : undefined, // [boolean] scroll the the target element (overwrites global setting if set)
			runBefore: function(){}, // [function] runs before activating the step
			runAfter: function(){} // [function] runs when the step gets deactivated
	    },
		{
			// next step...
		}
	], 
	{
		// global options
		scrollAlways : true, // allways scroll to the next / prev step, can be overwritten through step's setting (default => true)
		hideKeyCode : 27, // close button key (default => 27)
		allowEventPropagation : true //(default => true)
	});


    