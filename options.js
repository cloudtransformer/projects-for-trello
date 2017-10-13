// Saves options to chrome.storage
function save_option(projectName, color) {
  console.log(projectName.val(), color.val());
  if(projectName.val() != "" && color.val() != ""){
    var _tmp = {};
    _tmp[projectName.val()] = color.val();
    chrome.storage.sync.set(_tmp, function(){ });
    projectName.val('');
    color.val(color.data('default'));
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
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get(null, function(items) {
    // TODO: work on
    for (item in items) {
      var node = $('<div></div>');
      node.html("<input type='text' class='spectrum color' value='"+items[item]+"'>" +
        "<input type='text' class='project-name' value='"+item+"'>" +
        "<button class='delete-button' data-name='"+item+"'>X</button>");
      $('#list').append(node);
    }
    $('.spectrum').spectrum({
      clickoutFiresChange: true,
      showInput: true,
      preferredFormat: "hex"
    });
    $(".delete-button").click(function(){
      delete_option($(this).data("name"));
    });
    $(".project-name").change(function(){
      save_option($(this), $(this).parent().children('.spectrum'));
    });
    $(".color").change(function(){
      save_option($(this).parent().children('.project-name'), $(this));
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
  console.log(items);
  chrome.storage.sync.clear(function () {});

  for (item in items) {
    console.log(item);
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
    save_option($('#new-project-name'), $('#new-color'));
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
