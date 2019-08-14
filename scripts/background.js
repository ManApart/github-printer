
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
    var promises = cards.map(card => new Promise((resolve, reject) => { cardDescription(resolve, reject, card, apiKey, orgs) }))
    return Promise.all(promises)
        .catch((err) => {
            throw err
        })
}

cardDescription = async function (resolve, reject, card, apiKey, orgs) {
    const cleanedOrgs = cleanOrgs(card.owner, orgs)
    console.log('starting loop')

    for (const org of cleanedOrgs) {
        console.log('attempt call')
        const description = await attemptCardCall(org, card, apiKey)
        if (description) {
            card.description = description
            console.log('break loop')
            resolve(card)
            break
        }
    }

    console.log(card)
    reject("Error Fetching card description after trying " + cleanedOrgs)
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

attemptCardCall = async function (org, card, apiKey) {
    console.log('calling ' + org + ":" + card.repoName + ":" + card.number)
    try {
        let result = await makeCardCall(org, card, apiKey)
        return result
    }
    catch (error) {
        console.error(error);
        return null
    }
}

makeCardCall = async function (org, card, apiKey) {
    var response = await fetch(`https://api.github.com/repos/${org}/${card.repoName}/issues/${card.number}`, {
        headers: {
            "Authorization": `Bearer ${apiKey}`
        }
    });

    var result = await response.json().then(function (data) {
        if (data.body) {
            return data.body.replace(/\n/g, "<br/>")
        }
        return ""
    })

    return result
}