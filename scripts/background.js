
var cards = []

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "print") {
        cards = request.cards
        chrome.storage.sync.get('apiKey', function (data) {
            if (data.apiKey) {
                addDescriptions(cards, data.apiKey).then(function (cards) {
                    console.log('returning cards')
                    chrome.tabs.create({ url: chrome.extension.getURL("print_view.html") });
                }).catch(function (err) {
                    alert('Error Fetching card descriptions!')
                    console.log(err)
                    chrome.tabs.create({ url: chrome.extension.getURL("print_view.html") });
                });
            } else {
                alert('API Key was blank. Please set an API Key')
            }
        });
    } else {
        console.log(request)
    }
    sendResponse(cards);
});

addDescriptions = function (cards, apiKey) {
    // var promises = [cardDescription(cards[0], apiKey)]
    var promises = cards.map(card => cardDescription(card, apiKey))
    return Promise.all(promises)
}

cardDescription = function (card, apiKey) {
    return new Promise(function (resolve, reject) {
        fetch(`https://api.github.com/repos/${card.owner}/${card.repoName}/issues/${card.number}`, {
            headers: {
                "Authorization": `Bearer ${apiKey}`
            }
        }).then(function (response) {
            response.json().then(function (data) {
                if (data.body) {
                    card.description = data.body.replace(/\n/g, "<br/>")
                }
                resolve(card)
            })
        }).catch(function (err) {
            console.log('Error Fetching card description for card')
            console.log(card)
            console.log(err)
            throw err
        });
    })
}