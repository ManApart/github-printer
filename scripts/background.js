
var cards = []

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "print") {
        cards = request.cards
        chrome.storage.sync.get('apiKey', function (data) {
            chrome.storage.sync.get('orgs', function (orgData) {
                if (data.apiKey) {
                    addDescriptions(cards, data.apiKey, data.orgs).then(function (cards) {
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
    } else {
        console.log(request)
    }
    sendResponse(cards);
});

addDescriptions = function (cards, apiKey, orgs) {
    var promises = [cardDescription(cards[0], apiKey, orgs)]
    // var promises = cards.map(card => cardDescription(card, apiKey))
    return Promise.all(promises)
}

cardDescription = async function (card, apiKey, orgs) {
    console.log('start loop')
    let cleanedOrgs = cleanOrgs(card.owner, orgs)
    console.log('cleaned orgs: ' + cleanedOrgs)
    for (let org of cleanedOrgs) {
        let description = await attemptCardCall(org, card, apiKey)
        if (description) {
            card.description = description
            console.log('resolve card ' + description)
            return card
        }
    }

    let errorText = "Error Fetching card description for card"
    console.log(errorText)
    console.log(card)
    throw errorText
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
        arguments.unshift(org)
    } else {
        return [org]
    }
}

attemptCardCall = async function (org, card, apiKey) {
    try {
        console.log('trying card for org ' + org)
        let result = await makeCardCall(org, card, apiKey)
        return result
    }
    catch (error) {
        console.error(error);
        return null
    }
}

makeCardCall = async function (org, card, apiKey) {
    console.log('Starting make call')
    var response = await fetch(`https://api.github.com/repos/${org}/${card.repoName}/issues/${card.number}`, {
        headers: {
            "Authorization": `Bearer ${apiKey}`
        }
    });

    console.log('parsing response')
    var result = await response.json().then(function (data) {
        console.log('parsed ' + data)
        if (data.body) {
            return data.body.replace(/\n/g, "<br/>")
        }
        return ""
    })

    console.log('parsed result' + result)
    return result
}


// cardDescription = function (card, apiKey) {
//     return new Promise(function (resolve, reject) {
//         fetch(`https://api.github.com/repos/${card.owner}/${card.repoName}/issues/${card.number}`, {
//             headers: {
//                 "Authorization": `Bearer ${apiKey}`
//             }
//         }).then(function (response) {
//             response.json().then(function (data) {
//                 if (data.body) {
//                     card.description = data.body.replace(/\n/g, "<br/>")
//                 }
//                 resolve(card)
//             })
//         }).catch(function (err) {
//             console.log('Error Fetching card description for card')
//             console.log(card)
//             console.log(err)
//             throw err
//         });
//     })
// }