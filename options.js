// Saves options to chrome.storage
function save_options() {
  var projectName = document.getElementById('projectName').value;
  var colorHex = document.getElementById('colorHex').value;
  if(projectName != "" && colorHex != ""){
    var _tmp = {}
    _tmp[projectName] = colorHex
    chrome.storage.sync.set(_tmp, function(){ });
    document.getElementById("list").innerHTML = '';
    restore_options()
  }else{
    alert("Must specify a Project name and Color");
  }
}

function reset_options () {
  chrome.storage.sync.clear(function () {
    document.getElementById("list").innerHTML = ""
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get(null, function(items) {
    // TODO: work on
    for (item in items) {
      var node = document.createElement("LI");
      node.innerHTML = "<li>" + item + ": <span style='color:"+items[item]+";'>" + items[item] + "</span></li>";
      document.getElementById("list").appendChild(node);
    }
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
                                                 save_options);

document.getElementById('reset').addEventListener('click',
                                                  reset_options);
