$(function() {
  $(".board-header").append('<a id="filterTrello" class="s4tLink quiet ed board-header-btn dark-hover" href="#"><span class="icon-sm board-header-btn-icon"></span><span class="text board-header-btn-text">Filter</span></a>');

  $( "#filterTrello" ).click(function() {
    var _tTmp = window.prompt("Insert the terms to filter","ALL");
    console.log(_tTmp);
    if (_tTmp=="ALL")
      {
        var divs = $(".list-card").show();
      }
      else
        {
          var divs = $(".list-card").hide();
          var divs = $(".list-card:has(."+_tTmp+")").show();

        }

  });

});



