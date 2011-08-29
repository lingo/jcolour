/**
 * Author: Luke Hudson <lukeletters@gmail.com>
 * See: http://lingo.github.com/jcolour
 *
 * Usage:
 * 		a = new Colr('#FF0000');  b = new Colr('rgba(128,200,100,0.4)');
 * 		c = new Colr('hsl(220, 20%, 30%)');
 * 		d = new Colr(); // random colour chosen
 * 		e = d.clone();
 *
 * 		a.red(); b.sat(); c.light(); a.hue(); b.green(); d.blue();
 * 		a.hsl().css();
 * 		b.css();
 * 		c.blend(a, 0.5);
 * 		d.lighten();
 * 		a.darken();
 * 		c.red(200);
 * 		a.hue(20).sat(10).light(3).css();
 */
function hex2rgb(hex) {
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
}

function Colr(cssclr) {
	if (cssclr instanceof Colr) {
		// copy ctor
		var c2 = new Colr();
		c2._css = cssclr._css;
		c2.clr = cssclr.clr.slice(); // clone arr
		c2.type = cssclr.type;
		return c2;
	}

	if (typeof(cssclr) != 'string') {
		cssclr = Colr.random();
	}

	this.type = 'rgb';
	this._css = cssclr;
	this.clr = [];

	cssclr = cssclr.replace(/^#/, '');

	if ((val = cssclr.match(/rgba\s*\(([^,]+),([^,]+),([^,]+),([^)]+)\)/))) {
		r = val[1]; g = val[2]; b = val[3]; o = val[4];
		c = [parseInt(r, 10), parseInt(g, 10), parseInt(b, 10), parseFloat(o, 10)];
	} else if ((val = cssclr.match(/rgb\s*\(([^,]+),([^,]+),([^)]+)\)/))) {
		r = val[1]; g = val[2]; b = val[3];
		c = [parseInt(r, 10), parseInt(g, 10), parseInt(b, 10), 1];
	} else if ((val = cssclr.match(/hsla\s*\(([^,]+),([^,]+),([^,]+),([^)]+)\)/))) {
		this.type = 'hsl';
		val.shift();
		val[0] = parseInt(val[0], 10);
		val[1] = parseInt(val[1], 10);
		val[2] = parseInt(val[2], 10);
		c = val;
		c.push(parseFloat(val[3]));
	} else if ((val = cssclr.match(/hsl\s*\(([^,]+),([^,]+),([^)]+)\)/))) {
		this.type = 'hsl';
		val.shift();
		val[0] = parseInt(val[0], 10);
		val[1] = parseInt(val[1], 10);
		val[2] = parseInt(val[2], 10);
		c = val;
		c.push(1);
	} else if (cssclr.match(/^[a-fA-F0-9]{6}$/)) {
		c = hex2rgb(cssclr);
		c.push(1);
	} else if ((val = cssclr.match(/^[a-fA-F0-9]{3}$/))) {
		val = val[0].split('');
		r = val[0]; g = val[1]; b = val[2];
		r = parseInt(r, 16);
		g = parseInt(g, 16);
		b = parseInt(b, 16);
		r = (r * 16) + r;
		g = (g * 16) + g;
		b = (b * 16) + b;
		c = [r, g, b, 1];
	}
	this.clr = c;
}

Colr.prototype.clone = function() {
	return new Colr(this);
};

Colr.prototype.blend = function(colr2, step) {
	if (typeof(step) == 'undefined') {
		step = 0.5;
	}
	step = Math.max(0, Math.min(1, step));
	colr2 = new Colr(colr2);
	var c = new Colr(), i, diff;
	clr1 = this.clr;
	clr2 = colr2.clr;
	if (!(clr1 && clr2)) {
		return new Colr(this);
	}
	for (i = 0; i < 3; i++) {
		diff = clr2[i] - clr1[i];
		c.clr[i] = clr1[i] + (diff * step);
		if (this.DEBUG) { _console.log('Colour.blend', clr1[i], clr2[i], diff, c[i]); }
	}
	c.type = 'rgb';
	return c;
};

Colr.prototype.blendhsl = function(colr2, step) {
	if (typeof(step) == 'undefined') {
		step = 0.5;
	}
	step = Math.max(0, Math.min(1, step));
	colr2 = new Colr(colr2).hsl();
	var c = new Colr().hsl(), i, diff;
	clr1 = this.clr;
	clr2 = colr2.clr;
	if (!(clr1 && clr2)) {
		return new Colr(this);
	}
	for (i = 0; i < 3; i++) {
		diff = clr2[i] - clr1[i];
		c.clr[i] = clr1[i] + (diff * step);
		if (this.DEBUG) { _console.log('Colour.blend', clr1[i], clr2[i], diff, c[i]); }
	}
	c.type = 'hsl';
	return c;
};
Colr.prototype.darken = function(step) {
	if (typeof(step) == 'undefined') {
		step = 0.5;
	}
	var c2 = this.hsl();
	c2.clr[2] *= 1 - step;
	return c2;
};

Colr.prototype.lighten = function(step) {
	if (typeof(step) == 'undefined') {
		step = 0.5;
	}
	var c2 = this.hsl();
	c2.clr[2] += c2.clr[2] * step;
	return c2;
};

Colr.prototype.css = function() {
	switch(this.type) {
		case 'hsl':
			this._css = 'hsla(' + this.clr[0] + ', ' + this.clr[1] + '%, ' + this.clr[2] + '%, ' + this.clr[3] + ')';
			break;
		case 'rgb':
			this._css = 'rgba(' + parseInt(this.clr[0],10) + ', ' + parseInt(this.clr[1],10) + ', ' + parseInt(this.clr[2],10) + ', ' + this.clr[3] + ')';
			break;
	}
	return this._css;
};

Colr.prototype.hsl = function () {
	if (this.type == 'hsl') {
		return this;
	}
	var rgb = this.clr.slice(); // clone
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
	this.type = 'hsl'; this.clr = [hue, S * 100, L * 100, 1];
	return this;
};


Colr.prototype.rgb = function (hsl) {
	if (this.type == 'rgb') {
		return this;
	}
	var H, L, S,
		R, G, B,
		X, chroma,
		m, rgb, i;

	var hsl = this.clr.slice(); // clone array.
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
	rgb[3] = hsl[3];
	this.type = 'rgb'; this.clr = rgb;
	return this;
} // end  hsl2rgb method

Colr.prototype.hue = function(x) {
	this.hsl();
	if (typeof(x) !== 'undefined') {
		this.clr[0] = x;
		return this;
	}
	return this.clr[0];
};

Colr.prototype.sat = function(x) {
	this.hsl();
	if (typeof(x) !== 'undefined') {
		this.clr[1] = x;
		return this;
	}
	return this.clr[1];
};

Colr.prototype.light = function(x) {
	this.hsl();
	if (typeof(x) !== 'undefined') {
		this.clr[2] = x;
		return this;
	}
	return this.clr[2];
};

Colr.prototype.alpha = function(x) {
	if (typeof(x) !== 'undefined') {
		this.clr[3] = x;
		return this;
	}
	return this.clr[3];
};

Colr.prototype.red = function(x) {
	this.rgb();
	if (typeof(x) !== 'undefined') {
		this.clr[0] = x;
		return this;
	}
	return this.clr[0];
};

Colr.prototype.green = function(x) {
	this.rgb();
	if (typeof(x) !== 'undefined') {
		this.clr[1] = x;
		return this;
	}
	return this.clr[1];
};

Colr.prototype.blue = function(x) {
	this.rgb();
	if (typeof(x) !== 'undefined') {
		this.clr[2] = x;
		return this;
	}
	return this.clr[2];
};

/**
 * Create a random colour
 * Returns:
 * 	string -- CSS format colour
 */
Colr.random = function() {
	var r = function (x) { return Math.floor(Math.random() * x); };
	return 'hsl(' + r(360) + ', ' + r(100) + '%, ' + r(100) + '%)'; // ' + Math.random() + ')';
};
