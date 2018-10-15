# Cut Bread
That's literally it, see how good you are at cutting bread with a friendly passive-aggresive chef cheering you on

Online demo of this web app at https://stonet2000.github.io/Cut-Bread/

<img src="https://github.com/StoneT2000/StoneT2000.github.io/blob/master/images/cutbread3.png"></img>

## Technical
Uses HTML, Javascript, CSS, and p5.js library

### How It Works
Finding the area of a bread cut is done by calculating the number of pixels that are colored and not white/transparent. All colored pixels are assumed to be a part of the bread.

Figuring out which bread slice the area is a part of is done by a function that assigns whether a pixel is on the 'left' or 'right' side of each slice (theres no real left or right, but more of a assignment of a relative direction). Then, the area for which a pixel corresponds to depends on its unique sequence of 'left' and 'right' assignments for each slice. Pixels with the same sequence of assignments then must be part of the same bread slice.

Displaying the slices is done by drawing the slices as white lines onto a seperate canvas element. Then by changing the `globalCompositeOperation` of the canvas to `source-atop`, and then drawing the background behind the bread piece onto the canvas, the slices are displayed.

<img src="https://github.com/StoneT2000/StoneT2000.github.io/blob/master/images/cutbread2.png">
