var started = true;
$(document).ready(function(){
  $("#percentages")[0].checked = true;
  $("#stats").on('change', function(){
    if ($("#stats")[0].checked == true){
      //$("#stats_wrapper").css("right","100px");
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

})