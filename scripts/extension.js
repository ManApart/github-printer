document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('sample').addEventListener('click', function () {
        chrome.runtime.sendMessage({ "action": "reset" }, function (data) {
            chrome.tabs.create({ url: chrome.extension.getURL("print_view.html") });
        });
    });

});