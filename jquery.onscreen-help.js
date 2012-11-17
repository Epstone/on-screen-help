;
(function ($, window, undefined) {
	
	/* A step is an internally used tutorial step */
	var Step = function () {
		// selector: Element to highlight
		// margin:   Space around element
		// addPadding: true or false
		// title: the objects name
	}
	
	/* The higlighter controls the 4 fading divs and changes their position 
	*  based on the selector.
	*/
	var Highlighter = function(){
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
		self.highlight = function(sel, addPadding, margin){
		
			//get offset of selector
				var $target = $(sel);
				
				if ($target.length === 0) {
					throw "selector " + sel + " is not existing.";
				}
				
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
					y1 += parseInt($target.css("padding-top"));
					x1 += parseInt($target.css("padding-left"));
				}
				
				//calc coords 2
				var x2 = x1 + width;
				var y2 = y1 + height;
				
				// top
				this.$b1.update(0, 0, "100%", y1);
				
				//right
				this.$b2.update(x2, y1, docWidth - x2, height);
				
				//bottom
				this.$b3.update(0, y1 + height, "100%", docHeight - y2);
				
				//left
				this.$b4.update(0, y1, x1, height);
				
				$('body,html').animate({
					scrollTop : (y1 - 50)
				}, 1000);
		
		}
		
	}
	
	/* A block object is one of the 4 black/gray DIV overlay elements */
	var Block = function () {
		var self = this;
		
		// create jquery element and add it to DOM
		var $elem = $("<div class='osh-block'/>");
		$("body").append($elem);
		
		// object properties
		self.x = undefined;
		self.y = undefined;
		self.width = undefined;
		self.height = undefined;
		
		/* update the blocks position and size */
		self.update = function (x, y, width, height) {
			
			$elem.css({
				"left" : x,
				"top" : y,
				"width" : width,
				"height" : height
			});
				
			self.x = x;
			self.y = y;
			self.width = width;
			self.height = height;
		}
	}
			
			// Create the defaults once
			var onScreenHelp = 'onScreenHelp',
			document = window.document,
			defaults = {
				propertyName : "value"
			};
			
			// The actual plugin constructor
			function Plugin(element, steps, options) {
				
				var self = this;
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
				
				// currently active tutorial step
				this.currStep = undefined;
				
				// all defined steps as indexed array
				this.stepsIndexed = [];
				
				// jQuery elem toolbar navigation buttons
				this.$buttons = undefined;
				
				// The highlighter object instance
				this.highlighter = new Highlighter();
				
				//build the navigation toolbar
				this.createToolbarBasic();
				this.createToolbarButtons();
			};
			
			/* Activates the wanted step and the link which belongs to it */
			Plugin.prototype.activateStep = function (step) {
				var self = this;

				// highlight and scroll there
				self.highlighter.highlight(step.selector, step.addPadding);
				self.showDescription(step);
				
				//remove the active css class from the previous link
				if (self.currStep) {
					self.currStep.$link.removeClass("active");
				}
				//add active css class to new $link
				self.currStep = step;
				self.currStep.$link.addClass("active");
			}
			
			/* Shows the next or previous tutorial step
			@ nextOrPrev [number] 1 for next, -1 for prev step
			 */
			Plugin.prototype.nextPrevStep = function (nextOrPrev) {
				var self = this;
				
				//no step active yet so show the first one
				if (!self.currStep) {
					self.activateStep(self.stepsIndexed[0]);
				} else {
					
					var nextIndex = self.currStep.index + nextOrPrev;
					
					//check upper array bound
					if (nextIndex >= self.stepsIndexed.length) {
						nextIndex = 0;
					}
					//check lower array bound
					else if (nextIndex < 0) {
						nextIndex = self.stepsIndexed.length - 1;
					}
					
					// activate step
					self.activateStep(self.stepsIndexed[nextIndex]);
					
				}
				
			}
			
			/* Creates the toolbar including the left and right navigation buttons */
			Plugin.prototype.createToolbarBasic = function () {
				var self = this;
				
				//creates the toolbar, its background and the left and right buttons
				var $toolbarBg = $("<div class='osh-toolbar-background' />").appendTo("body");
				self.$buttons = $("<ul class='osh-button-list' />");
				var $btnLeft = $("<a class='left osh-button' href='#'>&lt;</a>");
				var $btnRight = $("<a href='#' class='right osh-button' >&gt;</a>");
				var $toolbar = $("<div class='osh-toolbar'></div>").append([$btnLeft, $btnRight, self.$buttons]);
				
				// bind step changer function to the left and right button
				$btnLeft.click(function (e) {
					e.preventDefault();
					self.nextPrevStep(-1);
				});
				$btnRight.click(function (e) {
					e.preventDefault();
					self.nextPrevStep(1);
				});
				
				$("body").append($toolbar);
				
			}
			
			/* Creates the toolbar buttons for jumping directly to a tutorial step */
			Plugin.prototype.createToolbarButtons = function(){
				var self = this;
				
				// create a button for each step
				var i = 0;
				$.each(this.steps, function (index, step) {
					
					// store index as title property
					step.title = index;
					
					//create indexed Array and store the index as reference in the tutorial step
					step.index = i;
					i++;
					self.stepsIndexed.push(step); 
					
					//create link element and store it to the step
					$link = $("<a href='#' class='osh-nav-link' />").text(step.title);
					$li = $("<li />").append($link);
					step.$link = $link;
					
					//switch to the wanted step when user clicks a navigation button
					$link.click(function (e) {
						e.preventDefault();
						
						// activates the clicked link and the tutorial step
						self.activateStep(step);
					});
					
					// append tutorial navigation buttons to toolbar
					self.$buttons.append($li);
				});
			
			
			}
			
			/* highlights the selector box by building black boxes around it */
			Plugin.prototype.showDescription = function (step) {
				
				if (!self.$description){
					//create description speech bubble if not yet existing
					self.$descriptionText = $("<div class='arrow_box' />");
					self.$description = $("<div class='arrow_box_outer'></div>").append(self.$descriptionText);
					
					$("body").append(self.$description);
				}
				
				// change text
				self.$descriptionText.text(step.description);
				var descrWidthAdd = self.$description.width() / 2;
				
				
				var $target = $(step.selector);
				var y = $target.offset().top +  $target.height() + parseInt($target.css("padding-top"),10);
				var x = $target.offset().left + ($target.width() / 2) - descrWidthAdd + parseInt($target.css("padding-left"),10);
				
				
				self.$description.css({"top": y, "left":x});
				
			}
			
			
			
			// A really lightweight plugin wrapper around the constructor,
			// preventing against multiple instantiations
			$.fn[onScreenHelp] = function (steps, options) {
				return this.each(function () {
					if (!$.data(this, 'plugin_' + onScreenHelp)) {
						$.data(this, 'plugin_' + onScreenHelp, new Plugin(this, steps, options));
					}
				});
			}
			
		}
		(jQuery, window));
