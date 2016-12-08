console.log('Script started');

(function() {

  var model = {
    iFrameId: 'content-frame',
    chatItemClass: 'chat-item',
    chatContainerId: 'chat-container',
    chatItems: null
  };

  var controller = {
    init: function() {
      const { iFrameId, chatItemClass } = model;
      
      view.init(iFrameId);
      
      if (view.docInsideIFrame) {
        model.chatItems = view.getChatItems(chatItemClass);
        
        if (model.chatItems) {
          console.log('Found these chat items:', model.chatItems.slice(-5)  );
          
          view.listenForNewChatItems(model.chatContainerId);
        }
        
      }
    },    
  };
  
  var view = { 
    chatIFrame: null,
    docInsideIFrame: null,
    
    init: function(iFrameId) {
      // Find iFrame holding the chat
      this.chatIFrame = document.getElementById(iFrameId);
      
      if (this.chatIFrame) {
        // Access the document within the iFrame
        this.docInsideIFrame = this.chatIFrame.contentDocument || this.chatIFrame.contentWindow.document;
      }
      
    },
    
    getChatItems: function(chatItemClass) {
      // Individual messages are wrapped 
      // inside a div with a 'chat-item' class
      const chatItems = this.docInsideIFrame.getElementsByClassName(chatItemClass);

      return chatItems ? Array.from(chatItems).map(el => el.innerHTML) : null;
    },
    
    listenForNewChatItems: function(chatContainerId) {
      console.log('Listening for new chat items');
      
      // create an observer instance
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if ((mutation.addedNodes || []).length > 0) {
            if ( /^chat-item\smodel/.test(mutation.addedNodes[0].className) ||
                 /^chat-item\sis/.test(mutation.addedNodes[0].className) ) {
              console.log('=====================');
              console.log(mutation.addedNodes);
              console.log(mutation.addedNodes[0].className);
              console.log(mutation.addedNodes[0].innerHTML);
            }
            
          }
        });    
      });
      
      // configuration of the observer:
      const config = { attributes: false, childList: true, characterData: false, subtree: true };
       
      // pass in the target node, as well as the observer options
      let target = view.docInsideIFrame.getElementById(chatContainerId);
      console.log('target', target);
      if (target) {
        observer.observe(target, config);
      } else {
        setTimeout(function() {
          target = view.docInsideIFrame.getElementById(chatContainerId);
          if (target) {
            observer.observe(target, config);
          }
        }, 5000);
      }
    }
    
  };

  window.onload = controller.init();

}());
