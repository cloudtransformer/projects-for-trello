// Saves options to chrome.storage
function save_option(projectName, bg_color, text_color) {
  console.log(projectName.val(), bg_color.val(), text_color.val());
  if(projectName.val() != "" && bg_color.val() != "" && text_color.val() != ""){
    var _tmp    = {};
    var _colors = {};
    _colors['bg']   = bg_color.val()
    _colors['text'] = text_color.val()
    _tmp[projectName.val().toLowerCase()] = _colors;
    chrome.storage.sync.set(_tmp, function(){ });
    projectName.val('');
    bg_color.val("#000");
    text_color.val("#fff");
    restore_options();
  }
}

function delete_option(option) {
  chrome.storage.sync.remove(option, function () {
    restore_options();
  });
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  document.getElementById("list").innerHTML = '';
  chrome.storage.sync.get(null, function(items) {
    for (item in items) {
      var node = $('<div></div>');
      node.html("<div class='color-name-bg_color-group'>"+
        "<input type='text' class='spectrum bg-color' value='"+items[item]['bg']+"'>" +
        "<input type='text' class='spectrum text-color' value='"+items[item]['text']+"'>" +
        "<input type='text' class='project-name' value='"+item+"'>"+
        "</div>" +
        "<button class='delete-button' data-name='"+item+"'><i><i class='fas fa-times'></i></button>");
      $('#list').append(node);
    }
    $('.spectrum.bg-color, #new-bg-color').spectrum({
      clickoutFiresChange: true,
      showInput: true,
      preferredFormat: "hex",
      chooseText: "Set Background",
    });
    $('.spectrum.text-color').spectrum({
      clickoutFiresChange: true,
      showInput: true,
      preferredFormat: "hex",
      chooseText: "Set Text Color"
    });
    $('#new-text-color').spectrum({
      clickoutFiresChange: true,
      showInput: true,
      preferredFormat: "hex",
      chooseText: "Set Text Color",
      color: "#ffffff"
    });
    $(".delete-button").click(function(){
      delete_option($(this).data("name"));
    });
    $(".project-name").change(function(){
      save_option($(this), $(this).parent().children('.spectrum.bg-color'), $(this).parent().children('.spectrum.text-color'));
    });
    $(".text-color").change(function(){
      save_option($(this).parent().children('.project-name'), $(this).parent().children('.spectrum.bg-color'), $(this))
    });
    $(".bg-color").change(function(){
      save_option($(this).parent().children('.project-name'), $(this), $(this).parent().children('.spectrum.text-color'));
    });
  });
}
function export_settings() {
  $("#sharing-options").toggle();
  chrome.storage.sync.get(null, function(items) {
    $("#export-import").val(JSON.stringify(items));
  });
}
function import_settings() {
  $("#sharing-options").toggle();
  var items = JSON.parse($("#export-import").val());
  chrome.storage.sync.clear(function () {});

  for (item in items) {
    var _tmp = {}
    _tmp[item] = items[item]
    chrome.storage.sync.set(_tmp, function(){ });
  }
  $("#export-import").val("")
  restore_options();
}
$(function(){
  restore_options();
  $('#add').click(function(){
    save_option($('#new-project-name'), $('#new-bg-color'), $('#new-text-color'));
  });
  $('#import-export').click(export_settings);
  $('#import-save').click(import_settings);

  $("#import-copy").click(function () {
    if($("#export-import").val() != ''){
      $("#export-import").select();
      document.execCommand('copy');
      $("#export-import").val("");
      $("#export-import").attr("placeholder", "Copied to clipboard!");
      setTimeout(function(){
        $("#export-import").attr("placeholder", "");
      }, 2000);
    }
  });
});
