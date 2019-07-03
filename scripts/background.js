
var cards = []

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "print") {
        cards = request.cards
        addDescriptions(cards).then(function (cards) {
            console.log('returning cards')
            chrome.tabs.create({ url: chrome.extension.getURL("print_view.html") });
        }).catch(function (err) {
            alert('Error Fetching card descriptions!')
            console.log(err)
            chrome.tabs.create({ url: chrome.extension.getURL("print_view.html") });
        });
    } else {
        console.log(request)
    }
    sendResponse(cards);
});

addDescriptions = function (cards) {
    // var promises = [cardDescription(cards[0])]
    var promises = cards.map(card => cardDescription(card))
    return Promise.all(promises)
}

cardDescription = function (card) {
    return new Promise(function (resolve, reject) {
        fetch(`https://api.github.com/repos/${card.owner}/${card.repoName}/issues/${card.number}`).then(function (response) {
            response.json().then(function (data) {
                if (data.body) {
                    card.description = data.body
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