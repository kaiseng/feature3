/* Display Time */
function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  var suffix = "AM";
  if (h >= 12) {
  suffix = "PM";
  h = h - 12;
  }
  if (h == 0) {
  h = 12;
  }
  // add a zero in front of numbers<10
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('time').innerHTML = h + ":" + m + ":" + s + " " + suffix;
  t = setTimeout(function() {
    startTime()
  }, 500);
}
startTime();

/* Display Date */
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;
var yyyy = today.getFullYear();

if(dd < 10) {
  dd = '0' + dd
}

if(mm < 10){
  mm = '0' + mm
}

today = dd + '/' + mm + '/' + yyyy;
document.write(today);

var latestDownloadId;

/*
Callback from getFileIcon.
Initialize the displayed icon.
*/
function updateIconUrl(iconUrl) {
  var downloadIcon = document.querySelector("#icon");
  downloadIcon.setAttribute("src", iconUrl);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

/*
If there was a download item,
- remember its ID as latestDownloadId
- initialize the displayed icon using getFileIcon
- initialize the displayed URL 
If there wasn't a download item, disable the "open" and "remove" buttons.
*/
function initializeLatestDownload(downloadItems) {
  var downloadUrl = document.querySelector("#url");
  if (downloadItems.length > 0) {
    latestDownloadId = downloadItems[0].id;
    var gettingIconUrl = browser.downloads.getFileIcon(latestDownloadId);
    gettingIconUrl.then(updateIconUrl, onError);
    downloadUrl.textContent = downloadItems[0].url;
    document.querySelector("#open").classList.remove("disabled");
    document.querySelector("#remove").classList.remove("disabled");
  } else {
    downloadUrl.textContent = "No downloaded items found."
    document.querySelector("#open").classList.add("disabled");
    document.querySelector("#remove").classList.add("disabled");
  }
}

/*
Search for the most recent download, and pass it to initializeLatestDownload()
*/
var searching = browser.downloads.search({
  limit: 1,
  orderBy: ["-startTime"]
});
searching.then(initializeLatestDownload);

/*
Open the item using the associated application.
*/
function openItem() {
  if (!document.querySelector("#open").classList.contains("disabled")) {
    browser.downloads.open(latestDownloadId);
  }
}

/*
Remove item from disk (removeFile) and from the download history (erase)
*/
function removeItem() {
  if (!document.querySelector("#remove").classList.contains("disabled")) {
    browser.downloads.removeFile(latestDownloadId);
    browser.downloads.erase({id: latestDownloadId});
    window.alert("Confirm Delete");
    window.close();
  }
}

document.querySelector("#open").addEventListener("click", openItem);
document.querySelector("#remove").addEventListener("click", removeItem);