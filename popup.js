var current_page = 1;
var records_per_page = 10;

var objJson = [];
function prevPage()
{
    if (current_page > 1) {
        current_page--;
        changePage(current_page);
    }
}

function nextPage()
{
    if (current_page < numPages()) {
        current_page++;
        changePage(current_page);
    }
}
    
function changePage(page)
{
    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");
    var page_span = document.getElementById("page");
 
    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    message.innerHTML = "";

    for (var i = (page-1) * records_per_page; i < (page * records_per_page); i++) {
        let template = `
          <div class="list-group-item  list-group-item-action d-flex align-items-center flex-row justify-content-between">
            <div class="d-flex flex-column justify-content-between col-8">
              <h6 class="mb-1">${objJson[i].word}</h5>
              <small>${objJson[i].definition}</small>
            </div>
            <img src="${objJson[i].imgSrc}" style="max-height: 80px;" " alt="">
          </div>`;
        message.innerHTML += template;
    }
    page_span.innerHTML = page + ' of '+ numPages();

    if (page == 1) {
        btn_prev.style.visibility = "hidden";
    } else {
        btn_prev.style.visibility = "visible";
    }

    if (page == numPages()) {
        btn_next.style.visibility = "hidden";
    } else {
        btn_next.style.visibility = "visible";
    }
}

function numPages()
{
    return Math.ceil(objJson.length / records_per_page);
}

$('#btn_next').click(function(){
  nextPage();
});
$('#btn_prev').click(function(){
  prevPage();
});
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}
chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
     // message.innerText = request.source;
     var doc = new DOMParser().parseFromString(request.source, 'text/html');
     var termsList = doc.getElementsByClassName("SetPageTerm-content");
     console.log(termsList.length);
     for(let item of termsList){
      let obj = {};
      let word = item.getElementsByClassName('SetPageTerm-wordText')[0].getElementsByTagName('span')[0].textContent;
      obj.word = word;
      let definition = item.getElementsByClassName('SetPageTerm-definitionText')[0].getElementsByTagName('span')[0].textContent;
      obj.definition = definition;
      let imageDivTag = item.getElementsByClassName('SetPageTerm-imageWrap')[0];
      let imgSrc = '';
      if(imageDivTag != undefined){
         imgSrc = imageDivTag.getElementsByTagName('a')[0].style.backgroundImage.replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
       }
       obj.imgSrc = imgSrc;
       objJson.push(obj);

      // message.append(htmlToElement(template));
     }
     changePage(1);
     console.log(objJson);
  }
});

function onWindowLoad() {

  var message = document.querySelector('#message');
  chrome.tabs.executeScript(null, {
     file: "getPagesSource.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });

}

window.onload = onWindowLoad;