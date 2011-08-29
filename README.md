# jcolour #

*Author:* Luke Hudson <lukeletters@gmail.com>
*See:* http://lingo.github.com/jcolour

## Javascript colour manipulation. ##

This provides a Colr class, which may be used as follows.

### Usage: ###

    // Set from CSS values
    a = new Colr('#FF0000');
    b = new Colr('rgba(128,200,100,0.4)');
    c = new Colr('hsl(220, 20%, 30%)');
    d = new Colr(); // random colour chosen
    e = d.clone();
    
    // Fetch components
    a.red(); b.sat(); c.light(); a.hue(); b.green(); d.blue();
    // Fetch CSS colour
    a.hsl().css();
    b.css();
    // Blend two colours, providing the blend step (0 returns first colour, 1 returns second, in between blends).
    c.blend(a, 0.5);

    d.lighten();
    a.darken();

    // Set components
    c.red(200);
    // Chaining
    a.hue(20).sat(10).light(3).css();
    
