document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('print').addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {}, function (response) {
                chrome.runtime.sendMessage({ "action": "update", "cards": response.cards }, function (data) {
                    chrome.tabs.create({ url: chrome.extension.getURL("print_view.html") });
                });
            });
        });
    });

    document.getElementById('sample').addEventListener('click', function () {
        chrome.runtime.sendMessage({ "action": "reset" }, function (data) {
            chrome.tabs.create({ url: chrome.extension.getURL("print_view.html") });
        });
    });

});