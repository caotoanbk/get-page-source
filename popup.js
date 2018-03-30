var message = $('#message');
var current_page = 1;
var records_per_page = 10;
var objJson = [];
/*chrome.tabs.executeScript(null, {
   file: "getPagesSource.js"
}, function() {
  // If you try and inject into an extensions page or the webstore/NTP you'll get an error
  if (chrome.runtime.lastError) {
    message.text('There was an error injecting script : \n' + chrome.runtime.lastError.message);
  }
});*/
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
    var btn_next = $("#btn_next");
    var btn_prev = $("#btn_prev");
    var page_span = $("#page");
 
    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    message.html("");
    let template = '';
    let descTemplate = '';
    let imgTemplate = '';
    for (var i = (page-1) * records_per_page; i < (page * records_per_page); i++) {
      descTemplate = objJson[i].definition?`<small>${objJson[i].definition}</small>`:'';
      imgTemplate = objJson[i].imgSrc?`<img src="${objJson[i].imgSrc}" style="max-height: 80px;" " alt="">`:'';
      template += `
        <div class="list-group-item  list-group-item-action d-flex align-items-center flex-row justify-content-between">
          <div class="d-flex flex-column justify-content-between col-8">
            <h6 class="mb-1">${objJson[i].word}</h5>
            ${descTemplate}
          </div>
          ${imgTemplate}
        </div>`;
        message.html(template);
    }
    page_span.text(page + ' of '+ numPages());

    if (page == 1) {
        btn_prev.attr('disabled', true);
    } else {
        btn_prev.attr('disabled', false);
    }

    if (page == numPages()) {
        btn_next.attr('disabled', true);
    } else {
        btn_next.attr('disabled', false);
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
     // var doc = new DOMParser().parseFromString(request.source, 'text/html');
     var doc = $(request.source);
     var termsList = doc.find(".SetPageTerm-content");
     let obj, word, definitionTag, definition, imageRef, imgSrc;
     for(let item of termsList){
      obj = {};
      word = $(item).find(".SetPageTerm-wordText span").eq(0).text();
      obj.word = word;
      definitionTag = $(item).find(".SetPageTerm-definitionText span");
      if(definitionTag.length !== 0){
      	definition = definitionTag.eq(0).text();
      } else {
      	definition ='';
      }
      obj.definition = definition;
      imageRef = $(item).find(".SetPageTerm-imageWrap a");
      if(imageRef.length !== 0){
         imgSrc = imageRef.eq(0).css('background-image').slice(0, -2).slice(5);
       } else {
       	imgSrc = '';
       }

       obj.imgSrc = imgSrc;
       objJson.push(obj);
     }
     changePage(1);
  }
});