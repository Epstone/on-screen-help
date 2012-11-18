;
(function ($, window, undefined) {
	"use strict";
	
	/* utility functions */
	function paddingLeft($elem) {
		return parseInt($elem.css("padding-left"), 10);
	}
	
	function paddingTop($elem) {
		return parseInt($elem.css("padding-top"), 10);
	}
	
	/* A step is an internally used tutorial step */
	var Step = function () {
		
		// selector: Element to highlight
		// margin:   Space around element
		// addPadding: true or false
		// title: the objects name
		// $zone -> clickable zone
	};
	
	/* SizeInfo object for easier size and position user interface updates
	 * x [number] left offset
	 * y [number] top offset
	 * width [string or number] css property for the width
	 * height [string or number] css property for the height
	 */
	var SizeInfo = function (x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	};
	
	/* Calculates the sizes and position for the UI elements */
	var Calculator = function () {
		var self = this;
		
		// our fading block size info objects
		self.b1 = self.b2 = self.b3 = self.b4 = undefined;
		
		/* Initializes the calculator and sets the sizeInfo results for the 4 fading blocks */
		self.initialize = function ($target, addPadding) {
			
			var offset = $target.offset();
			var width = $target.width();
			var height = $target.height();
			var docWidth = $(document).width();
			var docHeight = $(document).height();
			
			// calc coords 1
			var y1 = offset.top;
			var x1 = offset.left;
			
			//add padding if necessary
			if (addPadding) {
				y1 += paddingTop($target);
				x1 += paddingLeft($target);
			}
			
			//calc coords 2
			var x2 = x1 + width;
			var y2 = y1 + height;
			
			// calc size info objects
			self.b1 = new SizeInfo(0, 0, "100%", y1);
			self.b2 = new SizeInfo(x2, y1, docWidth - x2, height);
			self.b3 = new SizeInfo(0, y1 + height, "100%", docHeight - y2);
			self.b4 = new SizeInfo(0, y1, x1, height);
			
			return this;
		};
		
	};
	
	/* The Higlighter instance controls the 4 fading divs and changes their position and size */
	var Highlighter = function () {
		var self = this;
		
		// keep a reference to all the fading blocks
		self.$b1 = new Block();
		self.$b2 = new Block();
		self.$b3 = new Block();
		self.$b4 = new Block();
		
		/* Builds 4 div fading blocks around the selected DOM element.
		 * @ sel [string] jQuery selector
		 * @ addPadding [bool] respect padding of element
		 * @ margin [number] space around the element to highlight
		 */
		self.highlight = function (sel, addPadding, margin) {
			
			//check that element is existing
			var $target = $(sel);
			if ($target.length === 0) {
				throw "selector " + sel + " is not existing.";
			}
			
			// calculate block size and positions
			var calc = new Calculator().initialize($target, addPadding);
			
			// update all block sizes and positions
			self.$b1.update(calc.b1);
			self.$b2.update(calc.b2);
			self.$b3.update(calc.b3);
			self.$b4.update(calc.b4);
			
			$('body,html').animate({
				scrollTop : (calc.b1.height - 50)
			}, 1000);
			
		};
		
		/* Shows a arrowed description bubble box */
		self.showDescription = function (step) {
			
			if (!self.$description) {
				//create description speech bubble if not yet existing
				self.$descriptionText = $("<div class='arrow_box' />");
				self.$description = $("<div class='arrow_box_outer'></div>").append(self.$descriptionText);
				
				$("body").append(self.$description);
			}
			
			// change text
			self.$descriptionText.text(step.description);
			var descrWidthAdd = self.$description.width() / 2;
			
			var $target = $(step.selector);
			var y = $target.offset().top + $target.height() + parseInt($target.css("padding-top"), 10);
			var x = $target.offset().left + ($target.width() / 2) - descrWidthAdd + parseInt($target.css("padding-left"), 10);
			
			self.$description.css({
				"top" : y,
				"left" : x
			});
			
		};
		
		/* Creates clickable buttons over the targeted step elements */
		self.buildClickableZones = function (steps, stepActivationCallback) {
			
			$.each(steps, function (index, step) {
				console.debug("zone creating");
				
				var $elem = $(step.selector);
				var offset = $(step.selector).offset();
				
				var $zone = $("<div class='osh-marked-zone' />")
					.appendTo("body")
					.css({
						"top" : offset.top + paddingTop($elem),
						"left" : offset.left + paddingLeft($elem),
						"width" : $elem.width(),
						"height" : $elem.height()
					});
					
				// add child class if this step has a parent step
				
				if(step.parent){
					$zone.addClass("is-child");
				}
				
				$("<div/>").append($("<p />").text(step.title)).appendTo($zone);
				
				//store a reference in the step for the zone
				step.$zone = $zone;
				
				//bind step activation callback to $zone click event
				step.$zone.click(function(e){
					stepActivationCallback.call(self, step);
				});
				
			});
			
		};
		
	};
	
	/* A block object is one of the 4 black/gray DIV overlay elements */
	var Block = function () {
		var self = this;
		
		// create jquery element and add it to DOM
		var $elem = $("<div class='osh-block'/>");
		$("body").append($elem);
		
		// object properties
		self.sizeInfo = undefined;
		
		/* update the blocks position and size */
		self.update = function (sizeInfo) {
			
			$elem.css({
				"left" : sizeInfo.x,
				"top" : sizeInfo.y,
				"width" : sizeInfo.width,
				"height" : sizeInfo.height
			});
			
			// keep track of current position and size
			self.sizeInfo = sizeInfo;
		};
	};
	
	/* Builds the toolbar for navigating between the different tutorial steps */
	var ToolbarCreator = function () {
		var self = this;
		
		//store a reference to the tutorial step buttons
		self.$buttons = undefined;
		
		/* Creates the toolbar including the left and right navigation buttons */
		self.createToolbarBasic = function (prevNextStepCallback) {
			
			//creates the toolbar, its background and the left and right buttons
			$("<div class='osh-toolbar-background' />").appendTo("body"); // toolbar background
			self.$buttons = $("<ul class='osh-button-list' />");
			var $btnLeft = $("<a class='left osh-button' href='#'>&lt;</a>");
			var $btnRight = $("<a href='#' class='right osh-button' >&gt;</a>");
			var $toolbar = $("<div class='osh-toolbar'></div>").append([$btnLeft, $btnRight, self.$buttons]);
			
			// bind step changer function to the left and right button
			$btnLeft.click(function (e) {
				e.preventDefault();
				prevNextStepCallback.call(self, -1);
			});
			$btnRight.click(function (e) {
				e.preventDefault();
				prevNextStepCallback.call(self, 1);
			});
			
			$("body").append($toolbar);
		};
		
		/* Creates the toolbar buttons for jumping directly to a tutorial step */
		self.createToolbarButtons = function (steps, stepActivationCallback) {
			
			// create a button for each step
			$.each(steps, function (index, step) {
				
				//create link element and store it to the step
				var $link = $("<a href='#' class='osh-nav-link' />").text(step.title);
				var $li = $("<li />").append($link);
				step.$link = $link;
				
				//switch to the wanted step when user clicks a navigation button
				$link.click(function (e) {
					e.preventDefault();
					
					// activates the clicked link and the tutorial step
					stepActivationCallback.call(self, step);
				});
				
				// append tutorial navigation buttons to toolbar
				self.$buttons.append($li);
			});
			
		};
	};
	
	/* Handles the tutorial steps and reacts on user events */
	var TutorialController = function () {
		var self = this;
		
		/* Searches up the DOM for a tutorial step which would be a parent to the 
		*  given jQuery element and returns the step
		*/
		function tryGetParent(steps, $elem) {
		
			var resultStep;
			$.each(steps, function (j, parStep) {
				if ($elem.parents(parStep.selector).length > 0) {
					resultStep = parStep;
				}
			});
			
			return resultStep;
		}
		
		// currently active tutorial step
		var _currStep;
		
		// all tutorial steps as indexed array
		var _stepsIndexed = [];
		
		// UI manipulation methods
		this.highlightCallback = undefined;
		this.showDescriptionCallback = undefined;
		
		/* Takes all raw tutorial steps and initializes the indexed array */
		self.initialize = function (rawSteps) {
			
			var i = 0;
			$.each(rawSteps, function (index, step) {
				
				// store index as title property
				step.title = index;
				
				//store the index as reference in the tutorial step
				step.index = i;
				step.$elem = $(step.selector);
				i++;
				
				//check if the element is contained in a parent step's element
				step.parent = tryGetParent(rawSteps, step.$elem);
				
				// add to indexed array
				_stepsIndexed.push(step);
				
			});
			
			return self.getSteps();
		};
		
		/* Returns the indexed tutorial steps array */
		self.getSteps = function () {
			return _stepsIndexed;
		};
		
		/* Activates the wanted step and the link which belongs to it */
		self.activateStep = function (newStep) {
			
			//do nothing if setp equals the previous one
			if (newStep === _currStep) {
				return;
			}
			
			// highlight and scroll there
			self.highlightCallback.call(self, newStep.selector, newStep.addPadding);
			self.showDescriptionCallback.call(self, newStep);
			
			newStep.$zone.hide();
			
			//remove the active css class from the previous link
			if (_currStep) {
				_currStep.$link.removeClass("active");
				
				if(_currStep === newStep.parent){
					console.log("previous step equals new steps parent");
					_currStep.$zone.hide();
				}else if (_currStep !== newStep.parent){
					console.log("previous step different to new steps parent");
					console.debug(_currStep.$zone);
					_currStep.$zone.show();
				
					if(_currStep.parent){
						_currStep.parent.$zone.show();
					}
				}
			}else if (newStep.parent){
				newStep.parent.$zone.hide();
			}
			
			//add active css class to new $link
			_currStep = newStep;
			_currStep.$link.addClass("active");
			
		};
		
		/* Shows the next or previous tutorial step
		 *  @ nextOrPrev [number] 1 for next, -1 for prev step
		 */
		self.nextPrevStep = function (nextOrPrev) {
			
			//no step active yet so show the first one
			if (!_currStep) {
				self.activateStep(_stepsIndexed[0]);
			} else {
				
				var nextIndex = _currStep.index + nextOrPrev;
				
				//check upper array bound
				if (nextIndex >= _stepsIndexed.length) {
					nextIndex = 0;
				}
				//check lower array bound
				else if (nextIndex < 0) {
					nextIndex = _stepsIndexed.length - 1;
				}
				
				// activate step
				self.activateStep(_stepsIndexed[nextIndex]);
			}
		};
	};
	
	/* --------------- jQuery Plugin Code --------------- */
	// Create the defaults once
	var onScreenHelp = 'onScreenHelp',
	document = window.document,
	defaults = {
		propertyName : "value"
	};
	
	// The actual plugin constructor
	function Plugin(element, steps, options) {
		
		this.element = element;
		
		this.options = $.extend({}, defaults, options);
		
		this.defaults = defaults;
		this.name = onScreenHelp;
		this.steps = steps;
		
		this.init();
		
	}
	
	Plugin.prototype.init = function () {
		// Place initialization logic here
		// You already have access to the DOM element and the options via the instance,
		// e.g., this.element and this.options
		
		
		// jQuery elem toolbar navigation buttons
		this.$buttons = undefined;
		
		// The highlighter object instance
		this.highlighter = new Highlighter();
		
		//the tutorial controller -> init callbacks for UI manipulation
		this.tutorialController = new TutorialController();
		
		var indexedSteps = this.tutorialController.initialize(this.steps);
		this.tutorialController.highlightCallback = this.highlighter.highlight;
		this.tutorialController.showDescriptionCallback = this.highlighter.showDescription;
		
		//create the marked clicable zones over the black fading boxes
		this.highlighter.buildClickableZones(indexedSteps, this.tutorialController.activateStep);
		
		// The Toolbar creator -> build it
		this.toolbarCreator = new ToolbarCreator();
		this.toolbarCreator.createToolbarBasic(this.tutorialController.nextPrevStep);
		this.toolbarCreator.createToolbarButtons(indexedSteps, this.tutorialController.activateStep);
		
	};
	
	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[onScreenHelp] = function (steps, options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + onScreenHelp)) {
				$.data(this, 'plugin_' + onScreenHelp, new Plugin(this, steps, options));
			}
		});
	};
	
}
	(jQuery, window));
