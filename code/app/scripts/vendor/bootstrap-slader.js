/* =========================================================
 * bootstrap-slader.js v3.0.0
 * =========================================================
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

(function( $ ) {

	var ErrorMsgs = {
		formatInvalidInputErrorMsg : function(input) {
			return "Invalid input value '" + input + "' passed in";
		},
		callingContextNotSladerInstance : "Calling context element does not have instance of Slader bound to it. Check your code to make sure the JQuery object returned from the call to the slader() initializer is calling the method"
	};

	var Slader = function(element, options) {
		var el = this.element = $(element).hide();
		var origWidth =  $(element)[0].style.width;

		var updateSlader = false;
		var parent = this.element.parent();


		if (parent.hasClass('slader') === true) {
			updateSlader = true;
			this.picker = parent;
		} else {
			this.picker = $('<div class="slader">'+
								'<div class="slader-track">'+
									'<div class="slader-selection"></div>'+
									'<div class="slader-handle"></div>'+
									'<div class="slader-handle"></div>'+
								'</div>'+
								'<div id="tooltip" class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'+
								'<div id="tooltip_min" class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'+
								'<div id="tooltip_max" class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'+
							'</div>')
								.insertBefore(this.element)
								.append(this.element);
		}

		this.id = this.element.data('slader-id')||options.id;
		if (this.id) {
			this.picker[0].id = this.id;
		}

		if (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch) {
			this.touchCapable = true;
		}

		var tooltip = this.element.data('slader-tooltip')||options.tooltip;

		this.tooltip = this.picker.find('#tooltip');
		this.tooltipInner = this.tooltip.find('div.tooltip-inner');

		this.tooltip_min = this.picker.find('#tooltip_min');
		this.tooltipInner_min = this.tooltip_min.find('div.tooltip-inner');

		this.tooltip_max = this.picker.find('#tooltip_max');
		this.tooltipInner_max= this.tooltip_max.find('div.tooltip-inner');

		if (updateSlader === true) {
			// Reset classes
			this.picker.removeClass('slader-horizontal');
			this.picker.removeClass('slader-vertical');
			this.tooltip.removeClass('hide');
			this.tooltip_min.removeClass('hide');
			this.tooltip_max.removeClass('hide');

		}

		this.orientation = this.element.data('slader-orientation')||options.orientation;
		switch(this.orientation) {
			case 'vertical':
				this.picker.addClass('slader-vertical');
				this.stylePos = 'top';
				this.mousePos = 'pageY';
				this.sizePos = 'offsetHeight';
				this.tooltip.addClass('right')[0].style.left = '100%';
				this.tooltip_min.addClass('right')[0].style.left = '100%';
				this.tooltip_max.addClass('right')[0].style.left = '100%';
				break;
			default:
				this.picker
					.addClass('slader-horizontal')
					.css('width', origWidth);
				this.orientation = 'horizontal';
				this.stylePos = 'left';
				this.mousePos = 'pageX';
				this.sizePos = 'offsetWidth';
				this.tooltip.addClass('top')[0].style.top = -this.tooltip.outerHeight() - 14 + 'px';
				this.tooltip_min.addClass('top')[0].style.top = -this.tooltip_min.outerHeight() - 14 + 'px';
				this.tooltip_max.addClass('top')[0].style.top = -this.tooltip_max.outerHeight() - 14 + 'px';
				break;
		}

		var self = this;
		$.each(['min', 'max', 'step', 'value'], function(i, attr) {
			if (typeof el.data('slader-' + attr) !== 'undefined') {
				self[attr] = el.data('slader-' + attr);
			} else if (typeof options[attr] !== 'undefined') {
				self[attr] = options[attr];
			} else if (typeof el.prop(attr) !== 'undefined') {
				self[attr] = el.prop(attr);
			} else {
				self[attr] = 0; // to prevent empty string issues in calculations in IE
			}
		});

		if (this.value instanceof Array) {
			if (updateSlader && !this.range) {
				this.value = this.value[0];
			} else {
				this.range = true;
			}
		} else if (this.range) {
			// User wants a range, but value is not an array
			this.value = [this.value, this.max];
		}

		this.selection = this.element.data('slader-selection')||options.selection;
		this.selectionEl = this.picker.find('.slader-selection');
		if (this.selection === 'none') {
			this.selectionEl.addClass('hide');
		}

		this.selectionElStyle = this.selectionEl[0].style;

		this.handle1 = this.picker.find('.slader-handle:first');
		this.handle1Stype = this.handle1[0].style;

		this.handle2 = this.picker.find('.slader-handle:last');
		this.handle2Stype = this.handle2[0].style;

		if (updateSlader === true) {
			// Reset classes
			this.handle1.removeClass('round triangle');
			this.handle2.removeClass('round triangle hide');
		}

		var handle = this.element.data('slader-handle')||options.handle;
		switch(handle) {
			case 'round':
				this.handle1.addClass('round');
				this.handle2.addClass('round');
				break;
			case 'triangle':
				this.handle1.addClass('triangle');
				this.handle2.addClass('triangle');
				break;
		}

		if (this.range) {
			this.value[0] = Math.max(this.min, Math.min(this.max, this.value[0]));
			this.value[1] = Math.max(this.min, Math.min(this.max, this.value[1]));
		} else {
			this.value = [ Math.max(this.min, Math.min(this.max, this.value))];
			this.handle2.addClass('hide');
			if (this.selection === 'after') {
				this.value[1] = this.max;
			} else {
				this.value[1] = this.min;
			}
		}
		this.diff = this.max - this.min;

		if (this.diff > 0) {
			this.percentage = [
				(this.value[0] - this.min) * 100 / this.diff,
				(this.value[1] - this.min) * 100 / this.diff,
				this.step * 100 / this.diff
			];
		} else {
			this.percentage = [0, 0, 100];
		}

		this.offset = this.picker.offset();
		this.size = this.picker[0][this.sizePos];

		this.formater = options.formater;
		this.tooltip_separator = options.tooltip_separator;
		this.tooltip_split = options.tooltip_split;

		this.reversed = this.element.data('slader-reversed')||options.reversed;

		this.layout();
		this.layout();

		this.handle1.on({
			keydown: $.proxy(this.keydown, this, 0)
		});

		this.handle2.on({
			keydown: $.proxy(this.keydown, this, 1)
		});

		if (this.touchCapable) {
			// Touch: Bind touch events:
			this.picker.on({
				touchstart: $.proxy(this.mousedown, this)
			});
		}
		// Bind mouse events:
		this.picker.on({
			mousedown: $.proxy(this.mousedown, this)
		});

		if(tooltip === 'hide') {
			this.tooltip.addClass('hide');
			this.tooltip_min.addClass('hide');
			this.tooltip_max.addClass('hide');
		} else if(tooltip === 'always') {
			this.showTooltip();
			this.alwaysShowTooltip = true;
		} else {
			this.picker.on({
				mouseenter: $.proxy(this.showTooltip, this),
				mouseleave: $.proxy(this.hideTooltip, this)
			});
			this.handle1.on({
				focus: $.proxy(this.showTooltip, this),
				blur: $.proxy(this.hideTooltip, this)
			});
			this.handle2.on({
				focus: $.proxy(this.showTooltip, this),
				blur: $.proxy(this.hideTooltip, this)
			});
		}

		this.enabled = options.enabled &&
						(this.element.data('slader-enabled') === undefined || this.element.data('slader-enabled') === true);
		if(this.enabled) {
			this.enable();
		} else {
			this.disable();
		}
	};

	Slader.prototype = {
		constructor: Slader,

		over: false,
		inDrag: false,

		showTooltip: function(){
            if (this.tooltip_split === false ){
                this.tooltip.addClass('in');
            } else {
                this.tooltip_min.addClass('in');
                this.tooltip_max.addClass('in');
            }

			this.over = true;
		},

		hideTooltip: function(){
			if (this.inDrag === false && this.alwaysShowTooltip !== true) {
				this.tooltip.removeClass('in');
				this.tooltip_min.removeClass('in');
				this.tooltip_max.removeClass('in');
			}
			this.over = false;
		},

		layout: function(){
			var positionPercentages;

			if(this.reversed) {
				positionPercentages = [ 100 - this.percentage[0], this.percentage[1] ];
			} else {
				positionPercentages = [ this.percentage[0], this.percentage[1] ];
			}

			this.handle1Stype[this.stylePos] = positionPercentages[0]+'%';
			this.handle2Stype[this.stylePos] = positionPercentages[1]+'%';

			if (this.orientation === 'vertical') {
				this.selectionElStyle.top = Math.min(positionPercentages[0], positionPercentages[1]) +'%';
				this.selectionElStyle.height = Math.abs(positionPercentages[0] - positionPercentages[1]) +'%';
			} else {
				this.selectionElStyle.left = Math.min(positionPercentages[0], positionPercentages[1]) +'%';
				this.selectionElStyle.width = Math.abs(positionPercentages[0] - positionPercentages[1]) +'%';

                var offset_min = this.tooltip_min[0].getBoundingClientRect();
                var offset_max = this.tooltip_max[0].getBoundingClientRect();

                if (offset_min.right > offset_max.left) {
                    this.tooltip_max.removeClass('top');
                    this.tooltip_max.addClass('bottom')[0].style.top = 18 + 'px';
                } else {
                    this.tooltip_max.removeClass('bottom');
                    this.tooltip_max.addClass('top')[0].style.top = -30 + 'px';
                }
			}

			if (this.range) {
				this.tooltipInner.text(
					this.formater(this.value[0]) + this.tooltip_separator + this.formater(this.value[1])
				);
				this.tooltip[0].style[this.stylePos] = this.size * (positionPercentages[0] + (positionPercentages[1] - positionPercentages[0])/2)/100 - (this.orientation === 'vertical' ? this.tooltip.outerHeight()/2 : this.tooltip.outerWidth()/2) +'px';

                this.tooltipInner_min.text(
					this.formater(this.value[0])
				);
                this.tooltipInner_max.text(
					this.formater(this.value[1])
				);

				this.tooltip_min[0].style[this.stylePos] = this.size * ( (positionPercentages[0])/100) - (this.orientation === 'vertical' ? this.tooltip_min.outerHeight()/2 : this.tooltip_min.outerWidth()/2) +'px';
				this.tooltip_max[0].style[this.stylePos] = this.size * ( (positionPercentages[1])/100) - (this.orientation === 'vertical' ? this.tooltip_max.outerHeight()/2 : this.tooltip_max.outerWidth()/2) +'px';

			} else {
				this.tooltipInner.text(
					this.formater(this.value[0])
				);
				this.tooltip[0].style[this.stylePos] = this.size * positionPercentages[0]/100 - (this.orientation === 'vertical' ? this.tooltip.outerHeight()/2 : this.tooltip.outerWidth()/2) +'px';
			}
		},

		mousedown: function(ev) {
			if(!this.isEnabled()) {
				return false;
			}
			// Touch: Get the original event:
			if (this.touchCapable && ev.type === 'touchstart') {
				ev = ev.originalEvent;
			}

			this.triggerFocusOnHandle();

			this.offset = this.picker.offset();
			this.size = this.picker[0][this.sizePos];

			var percentage = this.getPercentage(ev);

			if (this.range) {
				var diff1 = Math.abs(this.percentage[0] - percentage);
				var diff2 = Math.abs(this.percentage[1] - percentage);
				this.dragged = (diff1 < diff2) ? 0 : 1;
			} else {
				this.dragged = 0;
			}

			this.percentage[this.dragged] = this.reversed ? 100 - percentage : percentage;
			this.layout();

			if (this.touchCapable) {
				// Touch: Bind touch events:
				$(document).on({
					touchmove: $.proxy(this.mousemove, this),
					touchend: $.proxy(this.mouseup, this)
				});
			}
			// Bind mouse events:
			$(document).on({
				mousemove: $.proxy(this.mousemove, this),
				mouseup: $.proxy(this.mouseup, this)
			});

			this.inDrag = true;
			var val = this.calculateValue();
			this.setValue(val);
			this.element.trigger({
					type: 'slideStart',
					value: val
				})
				.data('value', val)
				.prop('value', val);
			return true;
		},

		triggerFocusOnHandle: function(handleIdx) {
			if(handleIdx === 0) {
				this.handle1.focus();
			}
			if(handleIdx === 1) {
				this.handle2.focus();
			}
		},

		keydown: function(handleIdx, ev) {
			if(!this.isEnabled()) {
				return false;
			}

			var dir;
			switch (ev.which) {
				case 37: // left
				case 40: // down
					dir = -1;
					break;
				case 39: // right
				case 38: // up
					dir = 1;
					break;
			}
			if (!dir) {
				return;
			}

			var oneStepValuePercentageChange = dir * this.percentage[2];
			var percentage = this.percentage[handleIdx] + oneStepValuePercentageChange;

			if (percentage > 100) {
				percentage = 100;
			} else if (percentage < 0) {
				percentage = 0;
			}

			this.dragged = handleIdx;
			this.adjustPercentageForRangeSladers(percentage);
			this.percentage[this.dragged] = percentage;
			this.layout();

			var val = this.calculateValue();
			this.setValue(val);
			this.element
				.trigger({
					type: 'slideStop',
					value: val
				})
				.data('value', val)
				.prop('value', val);
			return false;
		},

		mousemove: function(ev) {
			if(!this.isEnabled()) {
				return false;
			}
			// Touch: Get the original event:
			if (this.touchCapable && ev.type === 'touchmove') {
				ev = ev.originalEvent;
			}

			var percentage = this.getPercentage(ev);
			this.adjustPercentageForRangeSladers(percentage);
			this.percentage[this.dragged] = this.reversed ? 100 - percentage : percentage;
			this.layout();

			var val = this.calculateValue();
			this.setValue(val);
			return false;
		},

		adjustPercentageForRangeSladers: function(percentage) {
			if (this.range) {
				if (this.dragged === 0 && this.percentage[1] < percentage) {
					this.percentage[0] = this.percentage[1];
					this.dragged = 1;
				} else if (this.dragged === 1 && this.percentage[0] > percentage) {
					this.percentage[1] = this.percentage[0];
					this.dragged = 0;
				}
			}
		},

		mouseup: function() {
			if(!this.isEnabled()) {
				return false;
			}
			if (this.touchCapable) {
				// Touch: Bind touch events:
				$(document).off({
					touchmove: this.mousemove,
					touchend: this.mouseup
				});
			}
			// Bind mouse events:
			$(document).off({
				mousemove: this.mousemove,
				mouseup: this.mouseup
			});

			this.inDrag = false;
			if (this.over === false) {
				this.hideTooltip();
			}
			var val = this.calculateValue();
			this.layout();
			this.element
				.data('value', val)
				.prop('value', val)
				.trigger({
					type: 'slideStop',
					value: val
				});
			return false;
		},

		calculateValue: function() {
			var val;
			if (this.range) {
				val = [this.min,this.max];
                if (this.percentage[0] !== 0){
                    val[0] = (Math.max(this.min, this.min + Math.round((this.diff * this.percentage[0]/100)/this.step)*this.step));
                }
                if (this.percentage[1] !== 100){
                    val[1] = (Math.min(this.max, this.min + Math.round((this.diff * this.percentage[1]/100)/this.step)*this.step));
                }
				this.value = val;
			} else {
				val = (this.min + Math.round((this.diff * this.percentage[0]/100)/this.step)*this.step);
				if (val < this.min) {
					val = this.min;
				}
				else if (val > this.max) {
					val = this.max;
				}
				val = parseFloat(val);
				this.value = [val, this.value[1]];
			}
			return val;
		},

		getPercentage: function(ev) {
			if (this.touchCapable && (ev.type === 'touchstart' || ev.type === 'touchmove')) {
				ev = ev.touches[0];
			}
			var percentage = (ev[this.mousePos] - this.offset[this.stylePos])*100/this.size;
			percentage = Math.round(percentage/this.percentage[2])*this.percentage[2];
			return Math.max(0, Math.min(100, percentage));
		},

		getValue: function() {
			if (this.range) {
				return this.value;
			}
			return this.value[0];
		},

		setValue: function(val) {

			if (!val) {
				val = 0;
			}

			this.value = this.validateInputValue(val);

			if (this.range) {
				this.value[0] = Math.max(this.min, Math.min(this.max, this.value[0]));
				this.value[1] = Math.max(this.min, Math.min(this.max, this.value[1]));
			} else {
				this.value = [ Math.max(this.min, Math.min(this.max, this.value))];
				this.handle2.addClass('hide');
				if (this.selection === 'after') {
					this.value[1] = this.max;
				} else {
					this.value[1] = this.min;
				}
			}
			this.diff = this.max - this.min;


			if (this.diff > 0) {
				this.percentage = [
					(this.value[0] - this.min) * 100 / this.diff,
					(this.value[1] - this.min) * 100 / this.diff,
					this.step * 100 / this.diff
				];
			} else {
				this.percentage = [0, 0, 100];
			}

			this.layout();

			var slideEventValue = this.range ? this.value : this.value[0];
			this.element
				.trigger({
					'type': 'slide',
					'value': slideEventValue
				})
				.data('value', this.value)
				.prop('value', this.value);
		},

		validateInputValue : function(val) {
			if(typeof val === 'number') {
				return val;
			} else if(val instanceof Array) {
				$.each(val, function(i, input) { if (typeof input !== 'number') { throw new Error( ErrorMsgs.formatInvalidInputErrorMsg(input) ); }});
				return val;
			} else {
				throw new Error( ErrorMsgs.formatInvalidInputErrorMsg(val) );
			}
		},

		destroy: function(){
			this.handle1.off();
			this.handle2.off();
			this.element.off().show().insertBefore(this.picker);
			this.picker.off().remove();
			$(this.element).removeData('slader');
		},

		disable: function() {
			this.enabled = false;
			this.handle1.removeAttr("tabindex");
			this.handle2.removeAttr("tabindex");
			this.picker.addClass('slader-disabled');
			this.element.trigger('slideDisabled');
		},

		enable: function() {
			this.enabled = true;
			this.handle1.attr("tabindex", 0);
			this.handle2.attr("tabindex", 0);
			this.picker.removeClass('slader-disabled');
			this.element.trigger('slideEnabled');
		},

		toggle: function() {
			if(this.enabled) {
				this.disable();
			} else {
				this.enable();
			}
		},

		isEnabled: function() {
			return this.enabled;
		},

		setAttribute: function(attribute, value) {
			this[attribute] = value;
		},

		getAttribute: function(attribute) {
			return this[attribute];
		}

	};

	var publicMethods = {
		getValue : Slader.prototype.getValue,
		setValue : Slader.prototype.setValue,
		setAttribute : Slader.prototype.setAttribute,
		getAttribute : Slader.prototype.getAttribute,
		destroy : Slader.prototype.destroy,
		disable : Slader.prototype.disable,
		enable : Slader.prototype.enable,
		toggle : Slader.prototype.toggle,
		isEnabled: Slader.prototype.isEnabled
	};

	$.fn.slader = function (option) {
		if (typeof option === 'string' && option !== 'refresh') {
			var args = Array.prototype.slice.call(arguments, 1);
			return invokePublicMethod.call(this, option, args);
		} else {
			return createNewSladerInstance.call(this, option);
		}
	};

	function invokePublicMethod(methodName, args) {
		if(publicMethods[methodName]) {
			var sladerObject = retrieveSladerObjectFromElement(this);
			var result = publicMethods[methodName].apply(sladerObject, args);

			if (typeof result === "undefined") {
				return $(this);
			} else {
				return result;
			}
		} else {
			throw new Error("method '" + methodName + "()' does not exist for slader.");
		}
	}

	function retrieveSladerObjectFromElement(element) {
		var sladerObject = $(element).data('slader');
		if(sladerObject && sladerObject instanceof Slader) {
			return sladerObject;
		} else {
			throw new Error(ErrorMsgs.callingContextNotSladerInstance);
		}
	}

	function createNewSladerInstance(opts) {
		var $this = $(this);
		$this.each(function() {
			var $this = $(this),
				slader = $this.data('slader'),
				options = typeof opts === 'object' && opts;

			// If slader already exists, use its attributes
			// as options so slader refreshes properly
			if (slader && !options) {
				options = {};

				$.each($.fn.slader.defaults, function(key) {
					options[key] = slader[key];
				});
			}

			$this.data('slader', (new Slader(this, $.extend({}, $.fn.slader.defaults, options))));
		});
		return $this;
	}

	$.fn.slader.defaults = {
		min: 0,
		max: 10,
		step: 1,
		orientation: 'horizontal',
		value: 5,
		range: false,
		selection: 'before',
		tooltip: 'show',
		tooltip_separator: ':',
		tooltip_split: false,
		handle: 'round',
		reversed : false,
		enabled: true,
		formater: function(value) {
			return value;
		}
	};

	$.fn.slader.Constructor = Slader;

})( window.jQuery );

/* vim: set noexpandtab tabstop=4 shiftwidth=4 autoindent: */
