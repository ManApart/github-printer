
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

cardDescription = async function (card, apiKey, orgs) {
    const cleanedOrgs = cleanOrgs(card.owner, orgs)
    console.log('cleaned orgs: ' + cleanedOrgs)
    return new Promise((resolve, reject) => {
        cardDescriptionRecursive(card, apiKey, cleanedOrgs)
            .then(description => {
                if (description) {
                    card.description = description
                    console.log('found description ' + description)
                    resolve(card)
                }
            }).catch((err) => {
                reject(err)
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

cardDescriptionRecursive = function (card, apiKey, cleanedOrgs) {
    return new Promise((resolve, reject) => {
        if (cleanedOrgs.length > 0) {
            const org = cleanedOrgs.pop()

            console.log('attempting  ' + org + ":" + card.repoName + ":" + card.number)

            makeCardCall(org, card, apiKey)
                .then(description => {
                    if (description) {
                        console.log('found description ' + description)
                        resolve(description)
                    } else {
                        console.log('No description for ' + org + ":" + card.repoName + ":" + card.number)
                        return cardDescriptionRecursive(card, apiKey, cleanedOrgs)
                    }
                }).catch((err) => {
                    console.log('Got error for ' + org + ":" + card.repoName + ":" + card.number)
                    // return cardDescriptionRecursive(card, apiKey, cleanedOrgs)
                })
        } else {
            console.log(card)
            reject("Error Fetching card description after trying all orgs")
        }
    })
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