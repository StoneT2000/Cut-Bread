var started = true;
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
  $("#stats").on('change', function(){
    if ($("#stats")[0].checked == true){
      //$("#stats_wrapper").css("right","100px");
      $("#stats_for_nerds").css("display","block");
    }
    else {
      $("#stats_for_nerds").css("display","none");
    }
  })

})