var cWidth = 1000;
var cHeight = 490;
var breadCanvas;
//URL's of breads in breads folder
var breads = ["bread3.png","bread4.png", "bread5.png","baguette1.png","sourdough1.png"];

//Whether user is slicing or not
var slicing = false;

//Storing all completed slices
var slices = [];

//Temporary slice that the user is currently making
var tempSlice = [];

//The resulting relative area sliced out regions and the center of those regions
var results = [];

var displayPercentages = true;

//Whether user is dragging or not
var dragging = false;
var boardCanvas;
var sliceCanvas;
var slicectxt
var numOfSlices = 0;
var breadID = 2;

function preload(){
  //Load default bread piece and the cutting board
  bimg = loadImage("breads/"+breads[breadID]);
  board = loadImage("cutboard3.png");
}
function setup(){
  cursor(CROSS)
  //Initialize canvases and off screen canvases
  breadCanvas = createCanvas(cWidth,cHeight); //The piece of bread
  boardCanvas = createGraphics(cWidth,cHeight); //Drawing the background cutting board
  sliceCanvas = createGraphics(cWidth,cHeight); //Drawing in the parts of the cutting board that gets shown when the bread is cut
  breadCanvas.parent('cutbread');
  
  //Resolution density d
  d = pixelDensity();
  
  //Load the current pixels
  loadPixels();
  
  textAlign(CENTER)
  textSize(16)
  
  //Get context of bread canvas and the slices canvas
  context = document.getElementById("defaultCanvas0").getContext('2d');
  slicectxt = sliceCanvas.elt.getContext('2d');
  
}
function draw(){
  clear();
  
  //Display Board
  imageMode(CORNER)
  boardCanvas.image(board,0,0,cWidth,cHeight);
  image(boardCanvas,0,0);
  
  //Display Bread
  imageMode(CENTER);
  image(bimg,cWidth/2-40,cHeight/2);
  
  imageMode(CORNER)
  stroke(255);
  strokeWeight(5);
  
  //Displace the currentslice
  //displaySlices(slices);
  
  //Display the slice canvas, which is just the cutting board overlayed over the lines of the slices.
  image(sliceCanvas,0,0);
  
  //Draw the dotted line indicating where the user is about to slice
  if (slicing) {
    dottedLine(tempSlice[0],tempSlice[1],mouseX,mouseY)
  }
  
  //Display the percentages of the regions in terms of area out of total area.
  if (displayPercentages == true){
    strokeWeight(2);
    for (var k=0;k<results.length;k++){
      text(results[k][0],results[k][1],results[k][2]);
    }
  }
}
function displaySlices(slices){
  
  for (var i = 0; i < slices.length; i+=4){
    //line(slices[i],slices[i+1],slices[i+2],slices[i+3]);
    //sliceCanvas.line(slices[i],slices[i+1],slices[i+2],slices[i+3]);
  }
}
function dottedLine(x1,y1,x2,y2){
  var dx = x2-x1;
  var dy = y2-y1;
  var dist = sqrt(dx*dx+dy*dy);
  var dist2 = dist/15 //dist/15 means each dotted line part is at max a length of 15
  var sx = dx/(dist2);
  var sy = dy/(dist2);
  for (var i = 0; i< dist2; i++){
    if (i%2 == 0){
      line(x1+i*sx,y1+i*sy,x1+(i+1)*sx,y1+(i+1)*sy);
      //line(x1+cos(angle)*10*i,y1+sin(angle)*10*i,x1+cos(angle)*10*(i+1),y1+10*(i+1)*sin(angle))
    }
  }
}
//Get the RGBA values at x,y of the canvas from the pixels[] array updated by loadPixels();
function fget(x,y){
  var off = ((y*d*cWidth + x)*d*4);
  var components = [ pixels[off], pixels[off + 1], pixels[off + 2], pixels[off + 3] ]
  return components;
}
function mousePressed(){
  //If mouse is within canvas, and user is not dragging
  if (mouseY <= cHeight && mouseY >=0 && mouseX >=0 && mouseX <= cWidth && started == true && dragging == false){
    //If this is the user's second click, complete the slice if not completed already.
    if (slicing == true){
      slicing = false;
      numOfSlices++;
      tempSlice.push(mouseX,mouseY);
      var currentSlice = extendV(tempSlice[0],tempSlice[1],mouseX,mouseY)
      slices.push(currentSlice[0],currentSlice[1],currentSlice[2],currentSlice[3]);
      tempSlice = [];
      check_and_update_board();
    }
    else{
      slicing = true;
      tempSlice.push(mouseX,mouseY);
    }
  }
  
}
//Switch piece of bread by clearing all canvases, resetting variables, and then randomly selecting a piece of bread different from the current one.
function switchBread(){
  sliceCanvas.clear();
  boardCanvas.clear();
  breadCanvas.clear();
  tempSlice = [];
  slices = [];
  results = [];
  numOfSlices = 0;
  slicing = false;
  dragging = false;
  var newID = round(random(0,breads.length-1));
  if (newID == breadID) {
    newID = (newID + 1) % breads.length;
  }
  breadID = newID;
  bimg = loadImage("breads/"+breads[breadID]);
}

//Calculates the areas of each region created by the slices and updates the results array, whilst also returning the areas themselves.
function calculateAreas(slices){
  //Calculate the area of the bread slices as a percentage
  //Essentially loop over the pixels array of the current canvas with the slice as displayed with a white line or empty pixel. If a pixel is close to RGB(255,255,255) or is RGBA(0,0,0,0), then its not a part of a piece of bread.
  
  //Store the resulting areas
  results = [];
  
  //If there's less than 4 elements in slices array, then there aren't any slices.
  if (slices.length < 4){
    //If no slices then its just one piece with 100%
    results.push(["100%",250,250])
    return;
  }
  
  //Store areas
  var areas = {
    
  };
  
  //Store the areas center's x position and y positions
  var centersx = {};
  var centersy = {};
  
  //Clear the background with white color
  background(255);
  
  //Draw the bread back on
  imageMode(CENTER);
  image(bimg,cWidth/2-40,cHeight/2)
  imageMode(CORNER)
  
  //Update the pixels[] array
  loadPixels();
  
  //Loop through every possible x,y position on the bread canvas
  for (var i = 0; i < cWidth; i++){
    for (var j = 0; j < cHeight; j++){
      colors = fget(i,j)
      if (colors[0]+colors[1]+colors[2] < 762 && colors[0]+colors[1]+colors[2] > 0){
        //Calculate which region it belongs to with hash function
        var hash_in = [];
        for (var k = 0; k< 4*numOfSlices; k+=4){
          //In hash_in, each element is a string of 0's and 1's determing which side of the line or slice it is on. Storing the 0 or 1 for every slice will then uniquely give it a hash,
          hash_in.push(side(i,j,slices[k],slices[k+1],slices[k+2],slices[k+3]));
        }
        //Hash is used as a key in areas, centersx, centersy objects.
        var hash = hashRegion(hash_in);
        
        //If hash not initialized already, initialize it into areas object
        if (areas[hash]){
          areas[hash]++;
          centersx[hash] += i;
          centersy[hash] += j;
        }
        else{
          areas[hash] = 1;
          centersx[hash] = i;
          centersy[hash] = j;
        }
      }
      else{

      }
    }
  }
  
  var totalArea = 0;
  
  //Calculate total area
  for (hashKey in areas) {
    totalArea += areas[hashKey]
  }
  
  for (hashKey in areas) {
    //Find the center of the region
    var cx = centersx[hashKey]/areas[hashKey];
    var cy = centersy[hashKey]/areas[hashKey];;
    
    //Generate the text and results and push it to the results array.
    var percentAreaText = ((areas[hashKey]/totalArea) * 100).toFixed(2) + "%"
    results.push([percentAreaText,cx,cy])
  }
  return areas;
  
}

//Returns a 0 or 1 dependeing on which side of the line defined by x2,y2,x3,y3 is the point x1,y1 on.
function side(x1,y1,x2,y2,x3,y3){
  var val = Math.sign((x3 - x2) * (y1 - y2) - (y3 - y2) * (x1 - x2))
  if (val == 0 || val == 1){
    return 0;
  }
  return 1;
}

//Using the 0's and 1's for choosing a side, generate a unique number for which area it is a part of
//Uses the fact that each subset of {1,-2,4,8,-16,...} is a unique subset in terms of the sum of its terms
function hashRegion(arr){
  var finalHash = 0;
  for (var i=0; i<arr.length; i ++){
    if (i%2 == 0){
      finalHash += arr[i] * pow(2 , i);
    }
    else{
      finalHash -= arr[i] * pow(2 , i);
    }
  }
  return finalHash;
}

//Given the parameters of a line, return the new parameters of a line to make it longer.
function extendV(x1,y1,x2,y2){
  var dx = x2-x1;
  var dy = y2-y1;
  var slope = dy/dx;
  if (abs(slope) == Infinity){
    return[x1,0,x2,cHeight];
  }
  return [x1-1000,y1-1000*slope,x2+1000,y2+1000*slope];
  
}
//If the mouse is being dragged, set dragging to true if it was previously false.
//If the user is already slicing but tried to drag, don't set dragging as true.
function mouseDragged(){
  if (dragging == false && slicing == true){
    dragging = true;
  }
}
//When user releases the mouse, if dragging and slicing, store the slice result and calculate the areas.
function mouseReleased(){
  if (dragging == true){
    if (slicing == true){
      slicing = false;
      numOfSlices++;
      tempSlice.push(mouseX,mouseY);
      var currentSlice = extendV(tempSlice[0],tempSlice[1],tempSlice[2],tempSlice[3])
      slices.push(currentSlice[0],currentSlice[1],currentSlice[2],currentSlice[3]);
      tempSlice = [];
      check_and_update_board();
      dragging = false;
    }
  }
}

//Calculate the standard deviation of a set of values in arr = [p1,p2,...]
function std(arr){
  var mean = 0;
  for (var i =0; i<arr.length;i++){
    mean += arr[i]
  }
  mean /= arr.length;
  var stdval = 0;
  for (var i =0; i<arr.length;i++){
    stdval += pow((arr[i]-mean),2)
  }
  return sqrt(stdval);
  
}

//Update the canvas look by overlaying the cutting board over the slicing lines. then update the message response in accordance to a 'eveness' score calculated using standard deviation of the areas of all the regions.
function check_and_update_board(){
  
  //Draw all the slices onto the sliceCanvas
  slicectxt.globalCompositeOperation = 'source-over';
  sliceCanvas.stroke(255,255,255);
  sliceCanvas.strokeWeight(6);
  for (var i = 0; i < slices.length; i+=4){
    //line(slices[i],slices[i+1],slices[i+2],slices[i+3]);
    sliceCanvas.line(slices[i],slices[i+1],slices[i+2],slices[i+3]);
  }
  
  //Then overlay the cutting board over the slices on sliceCanvas
  slicectxt.globalCompositeOperation = 'source-atop'
  sliceCanvas.image(board,0,0,cWidth,cHeight);
  
  
  var pieces = calculateAreas(slices);
  var count = 0;
  for (hashKey in pieces){
    count ++;
  }
  $("#numpieces").text(count);
  $("#numslices").text(numOfSlices);
  var stdval = 0;
  //Calculate the score
  var percentages = [];
  for (var i =0; i<results.length;i++){
    percentages.push(parseFloat(results[i][0]));
  }
  stdval = std(percentages);
  var score = 100 - stdval;
  score = score.toFixed(2);
  $("#eveness").text(score + "/100");
  $("#std").text(stdval.toFixed(3));
  //Generate the messages in response to the cutting score.
  if (score < 60){
    var randomNum = round(random(0,paMessages0.length-1));
    $("#messageResponse").text(paMessages0[randomNum]);
  }
  else if (score < 80){
    var randomNum = round(random(0,paMessages1.length-1));
    $("#messageResponse").text(paMessages1[randomNum]);
  }
  else if (score < 90){
    var randomNum = round(random(0,paMessages2.length-1));
    $("#messageResponse").text(paMessages2[randomNum]);
  }
  else if (score <= 95){
    var randomNum = round(random(0,paMessages3.length-1));
    $("#messageResponse").text(paMessages3[randomNum]);
  }
  else if (score <= 99.9){
    var randomNum = round(random(0,paMessages4.length-1));
    $("#messageResponse").text(paMessages4[randomNum]);
  }
  else {
    //If you got this score, you probably cheated
    if (numOfSlices <= 1){
      var randomNum = round(random(0,paMessages5_1.length-1));
      $("#messageResponse").text(paMessages5_1[randomNum]);
    }
    else {
      var randomNum = round(random(0,paMessages5.length-1));
      $("#messageResponse").text(paMessages5[randomNum]);
    }
    
  }
  
  
  
}