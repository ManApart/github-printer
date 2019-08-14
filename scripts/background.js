
var cards = []

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "print") {
        cards = request.cards
        chrome.storage.sync.get('apiKey', function (data) {
            chrome.storage.sync.get('orgs', function (orgData) {
                if (data.apiKey) {
                    addDescriptions(cards, data.apiKey, orgData.orgs).then(function (cards) {
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
        });
    }
    sendResponse(cards);
});

addDescriptions = function (cards, apiKey, orgs) {
    // var promises = [cardDescription(cards[0], apiKey, orgs)]
    var promises = cards.map(card => cardDescription(card, apiKey, orgs))
    return Promise.all(promises)
        .catch((err) => {
            throw err
        })
}

cardDescription = function (card, apiKey, orgs) {
    const cleanedOrgs = cleanOrgs(card.owner, orgs)
    return new Promise((resolve, reject) => {
        const promises = cleanedOrgs.map(org => makeCardCall(org, card, apiKey))
        Promise.all(promises).then((results) => {
            const description = results.find(element => { return element && element.length > 0 })
            if (description) {
                card.description = description
            }
            resolve(card)
        })
    })
}

//Move the card's owner to the front of the list so it is tried first
cleanOrgs = function (org, otherOrgs) {
    if (otherOrgs) {
        for (var i = otherOrgs.length - 1; i >= 0; i--) {
            if (otherOrgs[i] === org) {
                otherOrgs.splice(i, 1)
                break
            }
        }
        otherOrgs.unshift(org)
        return otherOrgs
    } else {
        return [org]
    }
}

makeCardCall = function (org, card, apiKey) {
    return new Promise((resolve, reject) => {
        fetch(`https://api.github.com/repos/${org}/${card.repoName}/issues/${card.number}`, {
            headers: {
                "Authorization": `Bearer ${apiKey}`
            }
        }).then(response => {
            response.json().then(function (data) {
                if (data.body) {
                    resolve(data.body.replace(/\n/g, "<br/>"))
                }
                resolve("")
            })
        })
    })
}