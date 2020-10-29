const electron = require('electron'); 
// Importing the net Module from electron remote 
const {ipcRenderer} = electron

var get = document.getElementById('get'); 

// $("#get").on('click', function() {
  
// })
get.addEventListener('click', () => { 
  var hostname = document.getElementById('hostname').value
  var api_key = document.getElementById('api_key').value
  var issue_id = document.getElementById('issue_id').value

  var object_get = {
      host_name: hostname,
      api_key: api_key,
      issue_id: issue_id
  }
  console.log(`${hostname} - ${api_key} - ${issue_id}`)
  ipcRenderer.send('get-issue-infor', object_get)

})

ipcRenderer.on('parse-issue-info', function(event, result) {
  console.log(result)
  document.getElementById('result').innerText = result
});
ipcRenderer.on('get-issue-error', function(event, result) {
  console.log(result)
  document.getElementById('error').innerText = result
});