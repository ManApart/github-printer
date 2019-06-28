document.addEventListener('DOMContentLoaded', function () {
    console.log('page loaded')

    chrome.runtime.sendMessage({ "action": "getData" }, function (data) {
        console.log(data)
    });

})

