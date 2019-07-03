
var cards = []

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "print") {
        cards = request.cards
        addDescriptions(cards).then(function (cards) {
            console.log('returning cards')
            chrome.tabs.create({ url: chrome.extension.getURL("print_view.html") });
        })
    } else {
        console.log(request)
    }
    sendResponse(cards);
});

addDescriptions = function (cards) {
    console.log('add descriptions')
    var description = cardDescription(cards[0])
    // return Promise.all([description])
    return Promise.all(cards.map(card => cardDescription(card)))
}

cardDescription = function (card) {
    return new Promise(function (resolve, reject) {
        var issueNumber = card.number.substr(1, card.number.length - 1)
        fetch(`https://api.github.com/repos/${card.owner}/${card.repoName}/issues/${issueNumber}`).then(function (response) {
            response.json().then(function (data) {
                console.log(data)
                card.description = data.body
                setTimeout(function () {
                    resolve(card)
                }, 1000)
            })
        })
    })
}