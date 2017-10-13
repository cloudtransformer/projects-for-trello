// Saves options to chrome.storage
function add_option() {
  var projectName = document.getElementById('projectName').value;
  var colorHex = document.getElementById('colorHex').value;
  if(projectName != "" && colorHex != ""){
    var _tmp = {}
    _tmp[projectName] = colorHex
    chrome.storage.sync.set(_tmp, function(){ });
    restore_options()
  }else{
    alert("Must specify a Project name and Color");
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
      var node = document.createElement("div");
      node.innerHTML = "<label class='current-project' data-name='"+item+"' data-color='"+items[item]+"'>"+
        "<span class='color-swath' style='background:"+items[item]+";'></span>"+
        "<span class='project-name'>" + item + "</span></label>" +
        "<button class='delete-button' data-name='"+item+"'>X</button>";
      document.getElementById("list").appendChild(node);
    }
    $(".delete-button").click(function(){
      delete_option($(this).data("name"));
    });
    $(".current-project").click(function(){
      $('#projectName').val($(this).data("name"));
      $('#colorHex').val($(this).data("color"));
      $("#colorHex").spectrum("set", $(this).data("color"));
    });
  });
}
function export_settings() {
  $("#export-import").toggle();
  $("#import-copy").toggle();
  $("#import-save").toggle();
  chrome.storage.sync.get(null, function(items) {
    $("#export-import").val(JSON.stringify(items));
  });
}
function import_settings() {
  $("#export-import").toggle();
  $("#import-copy").toggle();
  $("#import-save").toggle();
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
  $('#add').click(add_option);
  $('#import-export').click(export_settings);
  $('#import-save').click(import_settings);

  $("#import-copy").click(function () {
    $("#export-import").select();
    document.execCommand('copy');
    $("#export-import").val("");
    $("#export-import").attr("placeholder", "Copied to clipboard!");
    setTimeout(function(){
      $("#export-import").attr("placeholder", "");
    }, 2000);
  });

  $("#colorHex").spectrum({
    color: "#f00",
    clickoutFiresChange: true,
    preferredFormat: "hex"
  });
  $("#colorHex").show();
  $("#colorHex").blur(function(){
    $(this).spectrum("set", $(this).val());
  });
});
