console.log('Script started');

(function() {

  var model = {
    pathname: null,
    iFrameId: 'content-frame',
    chatItemClass: 'chat-item',
    chatContainerId: 'chat-container',
    chatItems: null
  };

  var controller = {
    init: function() {
      
      model.pathname = this.getPathname();
      
      const { iFrameId, chatItemClass } = model;
      
      view.init(iFrameId);
      
      if (view.docInsideIFrame) {
        model.chatItems = view.getChatItems(chatItemClass);
        
        if (model.chatItems) {
          console.log('Found these chat items:', model.chatItems );
          
          setTimeout(() => {
            console.log('After 5 sec, listening for new items');
            view.listenForNewChatItems(model.chatContainerId);
          }, 5000);
          
        }
        
      }
    },
    
    getPathname: function() {
      return window.location.pathname;
    },
    
    processNewChatItem: function(newItem) {
      model.chatItems.push(newItem);
      console.log(model.chatItems);
    },
    
    createNewChatItemObject: function(object) {
      const { className, innerHTML } = object;
      return {
        className: className,
        innerHTML: innerHTML
      };
    }

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
      
      // console.log('Full chat items:', chatItems);
      
      return chatItems ? 
        Array.from(chatItems).map(item => controller.createNewChatItemObject(item)) : null;
    },
    
    listenForNewChatItems: function(chatContainerId) {
      
      // create an observer instance
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if ((mutation.addedNodes || []).length > 0) {
            if ( /^chat-item\smodel/.test(mutation.addedNodes[0].className) ||
                 /^chat-item\sis/.test(mutation.addedNodes[0].className) ) {
              console.log('=====================');
              let newChatItemObject = controller.createNewChatItemObject(mutation.addedNodes[0]);
              controller.processNewChatItem(newChatItemObject);
            }
            
          }
        });    
      });
      
      // configuration of the observer:
      const config = { attributes: false, childList: true, characterData: false, subtree: true };
       
      // pass in the target node, as well as the observer options
      let target = view.docInsideIFrame.getElementById(chatContainerId);
      // console.log('target', target);
      
      if (target) {
        observer.observe(target, config);
      } else {
        setTimeout(() => {
          target = view.docInsideIFrame.getElementById(chatContainerId);
          console.log('Startup backup observer after 5 sec, target', target);
          if (target) {
            observer.observe(target, config);
          }
        }, 5000);
      }
    }
    
  };

  window.onload = controller.init.bind(controller);


}());
