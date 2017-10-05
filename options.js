// Saves options to chrome.storage
function save_options() {
  var projectName = document.getElementById('projectName').value;
  var colorHex = document.getElementById('colorHex').value;
  var _tmp = {}
  _tmp[projectName] = colorHex
  var node = document.createElement("LI");
  node.innerHTML = "<li>" + projectName + ": " + colorHex + "</li>";
  document.getElementById("list").appendChild(node);

  chrome.storage.sync.set(_tmp, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
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
    for (item in items)
    {
	var node = document.createElement("LI");  
	node.innerHTML = "<li>" + item + ": " + items[item] + "</li>";
        document.getElementById("list").appendChild(node);


    }

  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);

document.getElementById('reset').addEventListener('click',
    reset_options);
