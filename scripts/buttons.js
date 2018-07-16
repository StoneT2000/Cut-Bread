var started = false;
$(document).on("ready",function(){
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

})