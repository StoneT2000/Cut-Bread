var cWidth = 1000;
var cHeight = 490;
var breadCanvas;
var breads = ["bread3.png","bread4.png", "bread5.png","baguette1.png","sourdough1.png"];
var slicing = false;
var slices = [];
var tempSlice = [];
var results = [];
var displayPercentages = true;
var dragging = false;
var boardCanvas;
var pcanvas;
var sliceCanvas;
var slicectxt
var numOfSlices = 0;
var breadID = 4;

function preload(){
  //Default bread slice selected for display
  bimg = loadImage("breads/"+breads[breadID]);
  board = loadImage("cutboard3.png");
  //gfont = loadFont("Gaegu-Regular.ttf");
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
  //imageMode(CENTER);
  textSize(15)
  pcanvas = document.getElementById("defaultCanvas0");
  context = pcanvas.getContext('2d');
  
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
  displaySlices(slices);
  image(sliceCanvas,0,0);
  if (slicing) {
    dottedLine(tempSlice[0],tempSlice[1],mouseX,mouseY)
  }
  if (displayPercentages == true){
    strokeWeight(2);
    for (var k=0;k<results.length;k++){
      text(results[k][0],results[k][1],results[k][2]);
    }
  }
}
function displaySlices(slices){
  
  for (var i = 0; i < slices.length; i+=4){
    line(slices[i],slices[i+1],slices[i+2],slices[i+3]);
    //sliceCanvas.line(slices[i],slices[i+1],slices[i+2],slices[i+3]);
  }
}
function dottedLine(x1,y1,x2,y2){
  var dx= x2-x1;
  var dy = y2-y1;
  var dist = sqrt(dx*dx+dy*dy);
  var angle = atan(dy/dx);
  var sx = dx/(dist/15);
  var sy = dy/(dist/15);
  
  for (var i = 0; i< dist/15; i++){
    if (i%2 == 0){
      line(x1+i*sx,y1+i*sy,x1+(i+1)*sx,y1+(i+1)*sy);
      //line(x1+cos(angle)*10*i,y1+sin(angle)*10*i,x1+cos(angle)*10*(i+1),y1+10*(i+1)*sin(angle))
    }
  }
  
  //console.log(x1,y1)
  //line(x1,y1,x1+cos(angle)*10,y1-10*sin(angle))
}
function fget(x,y){
  //y = parseInt(y.toFixed(0));
  var off = ((y*d*cWidth + x)*d*4);
  var components = [ pixels[off], pixels[off + 1], pixels[off + 2], pixels[off + 3] ]
  return components;
}



function mousePressed(){
  if (mouseY <= cHeight && mouseY >=0 && mouseX >=0 && mouseX <= cWidth && started == true && dragging == false){
    //Complete the slice if done already
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
function calculateAreas(slices){
  //Calculate the area of the bread slices as a percentage
  //Essentially loop over the pixels array of the current canvas with the slice as displayed with a
  //White line. If a pixel is close to RGB(255,255,255), then its not a part of a piece of bread.
  results = [];
  if (slices.length < 4){
    //If no slices then its just one piece with 100%
    results.push(["100%",250,250])
    return;
  }
  var areas = {
    
  };
  var centersx = {};
  var centersy = {};
  background(255);
  imageMode(CENTER);
  image(bimg,cWidth/2-40,cHeight/2)
  imageMode(CORNER)
  loadPixels();
  for (var i = 0; i < cWidth; i++){
    for (var j = 0; j < cHeight; j++){
      colors = fget(i,j)
      if (colors[0]+colors[1]+colors[2] < 762 && colors[0]+colors[1]+colors[2] > 0){
        //Calculate which region it belongs to with hash function
        var zeon = [];
        for (var k = 0; k< 4*numOfSlices; k+=4){
          zeon.push(side(i,j,slices[k],slices[k+1],slices[k+2],slices[k+3]));
        }
        var hash = hashRegion(zeon);

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
  //console.log("Left: " + areas[0]/totalArea, "Right: " + areas[1]/totalArea);
  
  for (hashKey in areas) {
    totalArea += areas[hashKey]
  }
  for (hashKey in areas) {
    var cx = centersx[hashKey]/areas[hashKey];
    var cy = centersy[hashKey]/areas[hashKey];;
    var percentAreaText = ((areas[hashKey]/totalArea) * 100).toFixed(2) + "%"
    results.push([percentAreaText,cx,cy])
  }

  return areas;
  
}
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
function extendV(x1,y1,x2,y2){
  var dx = x2-x1;
  var dy = y2-y1;
  var slope = dy/dx;
  if (abs(slope) == Infinity){
    return[x1,0,x2,cHeight];
  }
  return [x1-1000,y1-1000*slope,x2+1000,y2+1000*slope];
  
}
function mouseDragged(){
  if (dragging == false && slicing == true){
    dragging = true;
  }
}
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
function std(arr){
  //Format arr = [p1,p2,p3]
  //Where pi = percent form
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
function check_and_update_board(){
  slicectxt.globalCompositeOperation = 'source-over';
  sliceCanvas.stroke(255,255,255);
  sliceCanvas.strokeWeight(6);
  for (var i = 0; i < slices.length; i+=4){
    //line(slices[i],slices[i+1],slices[i+2],slices[i+3]);
    sliceCanvas.line(slices[i],slices[i+1],slices[i+2],slices[i+3]);
  }
  slicectxt.globalCompositeOperation = 'source-atop'
  sliceCanvas.image(board,0,0,cWidth,cHeight);
  var pieces = calculateAreas(slices);
  var count = 0;
  for (hashKey in pieces){
    count ++;
  }
  $("#numpieces").text(count);
  
  //var stdval = 0;
  var percentages = [];
  for (var i =0; i<results.length;i++){
    percentages.push(parseFloat(results[i][0]));
  }
  stdval = std(percentages);
  var score = 100 - stdval;
  score = score.toFixed(2);
  $("#eveness").text(score + "/100");
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