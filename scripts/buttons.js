var started = true;
$(document).ready(function(){
  $("#sorry").css("display","none");
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    //Check if on mobile or not
    //$("body").css("overflow","hidden");
    
  }
  else {
    //$("#sorry").css("display","none");
  }
  $("#percentages")[0].checked = true;
  $("#stats").on('change', function(){
    if ($("#stats")[0].checked == true){
      $("#stats_for_nerds").css("display","block");
    }
    else {
      $("#stats_for_nerds").css("display","none");
    }
  })
  $("#percentages").on('change', function(){
    if ($("#percentages")[0].checked == true){
      displayPercentages = true;
    }
    else {
      displayPercentages = false;
    }
  })
  $("#cutbread").on("touchmove", function (e) {
    e.preventDefault();
  })

})