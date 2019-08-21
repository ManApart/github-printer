var cards = []

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "print") {
        cards = request.cards
        chrome.storage.sync.get('apiKey', (data) => {
            chrome.storage.sync.get('orgs', (orgData) => {
                if (data.apiKey) {
                    addDescriptions(cards, data.apiKey, orgData.orgs).then((cards) => {
                        console.log('returning cards')
                        chrome.tabs.create({ url: chrome.extension.getURL("print_view.html") });
                    }).catch((err) => {
                        alert('Couldn\'t fetch all cards:\n' + err)
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
    var promises = cards.map(card => new Promise((resolve, reject) => {
        if (card.description) {
            resolve(card)
        } else {
            cardDescription(resolve, reject, card, apiKey, orgs)
        }
    }))
    return Promise.all(promises)
        .catch((err) => {
            throw err
        })
}

cardDescription = async function (resolve, reject, card, apiKey, orgs) {
    const cleanedOrgs = cleanOrgs(card.owner, orgs)

    var foundDescription = false
    for (const org of cleanedOrgs) {
        console.log('attempt org call for  ' + org + ":" + card.repoName + ":" + card.number)
        const description = await makeCardCall(org, card, apiKey)
        if (description != undefined) {
            card.description = description
            card.owner = org
            foundDescription = true
            resolve(card)
            break
        }
    }

    if (!foundDescription) {
        console.log(card)
        reject("Error Fetching description for " + card.repoName + ":" + card.number + " after trying orgs: " + cleanedOrgs)
    }
}

//Move the card's owner to the front of the list so it is tried first
cleanOrgs = function (org, otherOrgs) {
    if (otherOrgs) {
        const cleanedOrgs = otherOrgs.slice(0)
        for (var i = cleanedOrgs.length - 1; i >= 0; i--) {
            if (cleanedOrgs[i] === org) {
                cleanedOrgs.splice(i, 1)
                break
            }
        }
        cleanedOrgs.unshift(org)
        return cleanedOrgs
    } else {
        return [org]
    }
}

makeCardCall = async function (org, card, apiKey) {
    var response = await fetch(`https://api.github.com/repos/${org}/${card.repoName}/issues/${card.number}`, {
        headers: {
            "Authorization": `Bearer ${apiKey}`
        }
    });

    var result = await response.json().then((data) => {
        if (data.id) {
            if (data.body) {
                return data.body.replace(/\n/g, "<br/>")
            }
            return ""
        }
        return undefined
    })

    return result
}