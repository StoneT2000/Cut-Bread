$(document).on("ready",function(){
  $("#clearit").on("click",function(){
    console.log("clear slices and reset")
    slices = [];
    tempSlice = [];
    numOfSlices = 0;
    slicing = false;
    results = [];
  })
})
document.ontouchstart = function(e){ 
    e.preventDefault(); 
}