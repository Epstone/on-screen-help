jQuery.on-screen-help
==============

A jQuery tutorial plugin for any web page.

 **Demo:**
[http://epstone.github.com/on-screen-help/demo/](http://epstone.github.com/on-screen-help/demo/ "DEMO")
#Installation
Include script *after* the jQuery library:

    <script src="/path/to/jquery.on-screen-help.js"></script> 

#Usage

    $("body").onScreenHelp([{
		  caption: "1", // caption for clickable zone,
		  navCaption: "Navigation button caption", // [optional] caption used as default
		  selector : "#preamble", // selector for element to be highlighted
		  description : "Speech bubble text", // text for description box
		  html : "<div> use either description or html</div>, // [optional] html for description box
		  padding: "all", // [optional] Respect padding: "none" (default), "all", or a combination of top, right, bottom, left
		  position:"bottom", // [optional] position of the speech bubble. top, left, bottom or right
		  startWith: true // [optional] this should be the step to start with
	     },
		{
			// next step...
		}], { options  // todo});


    