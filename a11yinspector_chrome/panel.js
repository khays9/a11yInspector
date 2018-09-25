// Written by Keith Hays
// Copyright (c) 2018 University of Illinois Board of Trustees. All rights reserved.
// 

function inspect() {
  var bInitialized = false;
  var bVisible = false;

  chrome.storage.local.get('bA11yInitialized', function(result) {
     bInitialized = false;
     if (result.bA11yInitialized) {
        bInitialized =  result.bA11yInitialized;
     }
  });

  chrome.storage.local.get('bA11yVisible', function(result) {
     bVisible = false;
     if (result.bA11yVisible) {
        bvisible = result.bA11yVisible;
     }
  });

  if (!bInitialized) {
    chrome.tabs.executeScript({code: "a11yInspector.eventMode = 'fae-util'; a11yInspector.init();"});
    chrome.storage.local.set({'bA11yInitialized': true}); 
  }
  else if (!bVisible) {
     chrome.tabs.executeScript({code: "a11yInspector.buildPanel();"});
  }
}
// This extension loads the saved background color for the current tab if one
// exists. The user can select a new background color from the dropdown for the
// current page, and it will be saved as part of the extension's isolated
// storage. The chrome.storage API is used for this purpose. This is different
// from the window.localStorage API, which is synchronous and stores data bound
// to a document's origin. Also, using chrome.storage.sync instead of
// chrome.storage.local allows the extension data to be synced across multiple
// user devices.
document.addEventListener('DOMContentLoaded', function() {
  var inspectBtn = document.getElementById('inspect');
  var headingsBtn = document.getElementById('headings');

  inspectBtn.addEventListener('click', function() {
    inspect();
    window.close();
  });

  inspectBtn.addEventListener('click', function() {
    window.close();
  });
});
