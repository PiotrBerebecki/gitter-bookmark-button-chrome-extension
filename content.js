console.log('Script started');

function modifyPage() {  
  
  console.log('in modify page');
  
  // Find chat iFrame
  var chatIFrame = document.getElementById('content-frame');

  // Access the document within the iFrame
  var docInsideIFrame = chatIFrame.contentDocument || chatIFrame.contentWindow.document;  
  
  // Get an array of DOM nodes with chat messages
  var chatItems = Array.from(docInsideIFrame.getElementsByClassName('chat-item'));
      
  // Variable for DOM element to be modified
  var chatElem;  
  
  // Loop through the chat messages
  chatItems.forEach(function(item) {
    // console.log('item', item);
    
    chatElem = item.getElementsByClassName('chat-item__details')[0];
    
    let favElem = document.createElement('i');
    favElem.className = 'icon-star-empty';
    favElem.style.color = '#C9ABD2';
    favElem.style.verticalAlign = 'middle';
    favElem.style.cursor = 'pointer';
    favElem.title = 'Click to bookmark this post.\nDouble click to see all your bookmarks.';
    
    favElem.addEventListener('click', handleFavSingleClick, false);
    favElem.addEventListener('dblclick', handleFavDoubleClick, false);
    
    function handleFavSingleClick(e) {
      console.log('clicked');
      e.target.style.color = '#753A88';
      e.target.removeEventListener('click', handleFavSingleClick, false);
    }
    
    function handleFavDoubleClick(e) {
      console.log('double clicked');
    }
    
    if (chatElem) {
      chatElem.appendChild(favElem);
      // console.log('chatElem', chatElem);
    }

  });

}

window.onload = function() {
  setTimeout(function() {
    modifyPage();
    addFavOnNewPage();
  }, 1000);
};


function addFavOnNewPage() {
  console.log('adding favs');
  
  // Find iFrame holding the chat
  const chatIFrame = document.getElementById('content-frame');
  
  // Access the document within the iFrame
  const docInsideIFrame = chatIFrame.contentDocument || chatIFrame.contentWindow.document;
  
  // Find chat parent
  // const elemToObserve = docInsideIFrame.getElementsByClassName('chat-header__action-grouping')[0];
  
  const elemToObserve = docInsideIFrame.getElementById('chat-container');
  
  
  // WORKS !!!
  // const elemToObserve = docInsideIFrame.getElementById('header');
  
  console.log('elemToObserve', elemToObserve);
  
  // Used to call the function only once
  let isSecondMutation = false;
  let wasFunctionCalled = false;
  
  // create an observer instance
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (isSecondMutation === true && wasFunctionCalled === false) {
        console.log(mutation);
        isSecondMutation = false;
        wasFunctionCalled = true;
        
        setTimeout(() => {
          modifyPage();
        }, 500);
        
        setTimeout(() => {
          wasFunctionCalled = false;
        }, 2500);

      } else {
        isSecondMutation = true;
      }
    });
  });
  
  // configuration of the observer:
  const config = { attributes: true, childList: true, characterData: true, subtree: false };
  
  // WORKS !!!
  // const config = { attributes: true, childList: true, characterData: true, subtree: false };
   
  // pass in the target node, as well as the observer options
  observer.observe(elemToObserve, config);

}
