/**
 *
 * jQuery colour manipulation
 * Accessed through $.colour
 *
 * Methods:
 *
 * $.colour.col2rgb -- convert given CSS colour to an array of R,G,B and A if alpha is provided in input.
 * $.colour.rgb2col -- convert given RGB(A) array back to a CSS colour
 * $.colour.hsl2rgb / rgb2hsl -- Convert between RGBA array and HSLA array.
 * $.colour.lighten(colour, factor) -- lighten by _factor_ which defaults to 0.25, factor should be between 0(no lightening) and 1 (full white)
 * $.colour.darken(colour, factor) -- darken by _factor_ which defaults to 0.25, factor should be between 0(no darkening) and 1 (full black)
 * $.colour.blend(color1, color2, factor) -- blend colours, default factor is 0.5, 0 = col1, 1 = col2.
 * $.colour.textColor -- return a suitable text colour, if provided colour is to be used as background.
 * $.colour.rgb2hex -- return hex representation of RGB array
 * $.colour.hex2rgb -- return RGB array from hex colour value
 *
 */
(function ($) {
	"use strict";

    var Colour = {
        DEBUG: false,
        lighten: function (clr, factor) {
            if (typeof(factor) == 'undefined') {
				factor = 0.25;
			}
            return this.blend(clr, '#FFFFFF', factor);
        },

        darken: function (clr, factor) {
            if (typeof(factor) == 'undefined') {
				factor = 0.25;
			}
            return this.blend(clr, '#000000', factor);
        },

        textColor: function (clr) {
            clr = this.col2rgb(clr);
            clr = this.rgb2hsl(clr);
            var l1 = (clr[2] + 0.6);
            if (l1 > 1) {
				l1 -= 1.0;
			}
            //if (Math.abs(l1 - clr[2]) < 0.2) {
            //    l1 = clr[2] <= 0.5 ? 1 : 0;
            //}
            clr[2] = l1;
            clr[0] = (clr[0] + 180) % 360;
            clr = this.hsl2rgb(clr);
            return this.col2hex(clr);
        },

        invert: function (clr) {
            clr = this.col2rgb(clr);
            for (var i = 0; i < 3; i++) {
                clr[i] = 255 - clr[i];
			}
            return this.col2hex(clr);
        },

        blend: function (clr1, clr2, step) {
            var c = [], i, diff;
            clr1 = this.col2rgb(clr1);
            clr2 = this.col2rgb(clr2);
            if (!(clr1 && clr2)) {
                return clr1;
            }
            for (i = 0; i < 3; i++) {
                diff = clr2[i] - clr1[i];
                c[i] = clr1[i] + (diff * step);
                if (this.DEBUG) { _console.log('Colour.blend', clr1[i], clr2[i], diff, c[i]); }
            }
            return this.rgb2hex(c);
        },

        hex2rgb: function (hex) {
             if (typeof(hex) == 'object' && hex.length === 3) {
                 return hex;
             }
             if (typeof(hex) !== 'string') {
                return hex;
             }
             var r, g, b;
             hex = hex.match(/[a-fA-F0-9]{2}/g);
             r = hex[0]; g = hex[1]; b = hex[2];
             return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
        },

        col2hex: function (clr) {
             return this.rgb2hex(this.col2rgb(clr));
        },

        rgb2hex: function (rgb) {
             var s = '#', i, c;
             if (this.DEBUG) { _console.log('Colour.rgb2hex', rgb); }
             for (i = 0; i < 3; i++) {
                 c = this.x2s(rgb[i]);
                 if (this.DEBUG) { _console.log('Colour.rgb2hex', c); }
                 s += c;
             }
             if (this.DEBUG) { _console.log('Colour.rgb2hex => ', s); }
             return s;
        },

        getColour: function (elt, css) {
            var ptr = $(elt).get(),
				c;
            if (this.DEBUG) { _console.log('Colour.getColour', elt, css); }
            if (this.DEBUG) { _console.log('Colour.getColour', ptr, ptr.ownerDocument); }
            while (ptr) {
                if (this.DEBUG) { _console.log('Colour.getColour', ptr, ptr.ownerDocument); }
                c = $.curCSS(ptr, css);
                if (c !== 'transparent') {
                    if (this.DEBUG) { _console.log('Colour.getColour', ptr, css, c, this.col2rgb(c)); }
                    return this.col2rgb(c);
                }
                ptr = ptr.parentNode;
            }
        },

		rgb2col: function (clr) {
			return sprintf("rgb%s(%d, %d, %d%s)", 
					(clr.length === 4) ? 'a' :'',
					clr[0], clr[1], clr[2], 
					(clr.length === 4) ? sprintf(", %1.2f", clr[3]) : ''
				);
		},

        col2rgb: function (str) {
            var c, r, g, b, _ignore, val, o = 1;

            if (this.DEBUG) { _console.log('Colour.col2rgb', str); }
            if (typeof(str) == 'object' && str.length === 3) {
                if (this.DEBUG) { _console.log('Colour.col2rgb ==> ', str); }
                return str;
            }
            if (typeof(str) !== 'string') {
                throw "Expected string in col2rgb, got " + str;
            }
            str = str.replace(/^#/, '');
            if ((val = str.match(/rgba\s*\(([^,]+),([^,]+),([^,]+),([^)]+)\)/))) {
                r = val[1]; g = val[2]; b = val[3]; o = val[4];
                c = [parseInt(r, 10), parseInt(g, 10), parseInt(b, 10), parseFloat(o, 10)];
                return c;
			} else if ((val = str.match(/rgb\s*\(([^,]+),([^,]+),([^)]+)\)/))) {
                r = val[1]; g = val[2]; b = val[3];
                c = [parseInt(r, 10), parseInt(g, 10), parseInt(b, 10)];
                return c;
			} else if ((val = str.match(/hsla\s*\(([^,]+),([^,]+),([^,]+),([^)]+)\)/))) {
				val.shift();
				val[0] = parseInt(val[0], 10);
				val[1] = parseInt(val[1], 10);
				val[2] = parseInt(val[2], 10);
				c = this.hsl2rgb(val);
				c.push(parseFloat(val[3]));
                return c;
			} else if ((val = str.match(/hsl\s*\(([^,]+),([^,]+),([^)]+)\)/))) {
				val.shift();
				val[0] = parseInt(val[0], 10);
				val[1] = parseInt(val[1], 10);
				val[2] = parseInt(val[2], 10);
				c = this.hsl2rgb(val);
                return c;
            } else if (str.match(/[a-fA-F0-9]{6}/)) {
                c = this.hex2rgb(str);
                return c;
            } else if ((val = str.match(/[a-fA-F0-9]{3}/))) {
                r = val[0]; g = val[1]; b = val[2];
                r = parseInt(r, 16);
                g = parseInt(g, 16);
                b = parseInt(b, 16);
                r = (r * 16) + r;
                g = (g * 16) + g;
                b = (b * 16) + b;
                c = [r, g, b];
                return c;
            }
            throw 'Invalid colour in col2rgb; given ' + str;
        },

        x2s: function (d) { var x = parseInt(d, 10).toString(16); if (x.length < 2) { x = '0' + x; } return x; },

		/**
		* Create a random colour
		* Returns:
		* 	string -- CSS format colour
		*/
		random: function() {
			var r = function (x) { return Math.floor(Math.random() * x); };
			return 'hsla(' + r(360) + ', ' + (20+r(80)) + '%, ' + (30+r(50)) + '%, 0.6)';
		},

        rgb2hsl: function (rgb) {
            var R, G, B, i, H, S, L,
				M, m, chroma, hue;
            for (i = 0; i < 3; i++) {
                rgb[i] = rgb[i] / 255.0;
			}
            R = rgb[0]; G = rgb[1]; B = rgb[2];
            M = Math.max(R, G, B);
            m = Math.min(R, G, B);
            chroma = M - m;
            if (chroma === 0) {
                hue = S = 0;
            } else {
                switch (M) {
                    case R:
                        hue = ((G - B) / chroma) % 6.0;
                        break;
                    case G:
                        hue = ((B - R) / chroma) + 2.0;
                        break;
                    case B:
                        hue = ((R - G) / chroma) + 4.0;
                        break;
                    default:
                        //throw "No value for hue is possible with greyscale";
                        hue = S = 0;
                        break;
                }
            }
            L = (M + m) / 2.0;
            if (S === undefined) {
                if (chroma === 0) {
                    S = 0;
				} else if (L <= 0.5) {
                    S = chroma / (2.0 * L);
				} else {
                    S = chroma / (2.0 - 2.0 * L);
				}
            }
            hue = hue * 60.0;
            return [hue, S * 100, L * 100];
        },

        hsl2rgb: function (hsl) {
            var H, L, S,
				R, G, B,
				X, chroma,
				m, rgb, i;

            H = hsl[0]; S = hsl[1] / 100.0; L = hsl[2] / 100.0;
            if (L <= 0.5) {
                chroma = 2.0 * L * S;
			} else {
                chroma = (2.0 - 2.0 * L) * S;
			}
            H /= 60.0;
            X = chroma * (1 - Math.abs((H % 2) - 1));

            m = L - chroma / 2.0;
            R = G = B = 0;
            if (H < 1) { R = chroma; G = X; }
            else if (H < 2) { R = X; G = chroma; }
            else if (H < 3) { G = chroma; B = X; }
            else if (H < 4) { G = X; B = chroma; }
            else if (H < 5) { R = X; B = chroma; }
            else if (H < 6) { R = chroma; B = X; }
            rgb = [R + m, G + m, B + m];
            for (i = 0; i < 3; i++) {
                rgb[i] = rgb[i] * 255.0;
			}
            return rgb;
        } // end  hsl2rgb method

    }; // End of Colour class

    $.extend({colour: Colour});

})(jQuery);
