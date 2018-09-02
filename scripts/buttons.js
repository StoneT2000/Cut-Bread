var started = false;
$(document).ready(function(){
  $("#clearit").on("click",function(){
    console.log("clear slices and reset")
    slices = [];
    tempSlice = [];
    numOfSlices = 0;
    slicing = false;
    results = [];
    $("#messageResponse").text("");
    $("#numpieces").text(0);
    $("#eveness").text("N/A")
  });
  $("#openingCover").on("click",function(){
    $("#openingCover").css("display","none");
    $("#openingCover").remove("click");
    started = true;
  });
  $("#displayP").on("click",function(){
    if (displayPercentages == true){
      displayPercentages = false;
    }
    else {
      displayPercentages = true;
    }
  })
  $("#change_bread").on("click", function(){
    breadNum = (breadNum + 1) % breads.length;
    bimg = loadImage(breads[breadNum]);
    console.log("clear slices and reset")
    slices = [];
    tempSlice = [];
    numOfSlices = 0;
    slicing = false;
    results = [];
    $("#messageResponse").text("");
    $("#numpieces").text(0);
    $("#eveness").text("N/A")
  })

})