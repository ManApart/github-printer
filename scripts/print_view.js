document.addEventListener('DOMContentLoaded', function () {
    console.log('page loaded')

    chrome.runtime.sendMessage({ "action": "getData" }, function (cards) {
        console.log(cards)

        document.body.innerHTML = cards.map(createDiv).join("");
    });

})

function createDiv(card) {
    var cardType;

    if (card.labels.includes("spike")) {
        cardType = "spike";
    } else if (card.labels.includes("bug")) {
        cardType = "bug";
    } else if (card.labels.includes("forecast")) {
        cardType = "forecast";
    } else if (card.labels.includes("Epic")) {
        cardType = "epic";
    } else {
        cardType = "story";
    }

    var theCard = `<div class='card'>`;

    switch (cardType) {
        case "spike":
            theCard += `<div class='headerSpike'>`;
            theCard += `<div class='typeSpike'>` + cardType.toUpperCase() + `</div>`;
            break;
        case "bug":
            theCard += `<div class='headerBug'>`;
            theCard += `<div class='typeBug'>` + cardType.toUpperCase() + `</div>`;
            break;
        case "forecast":
            theCard += `<div class='headerForecast'>`;
            theCard += `<div class='typeForecast'>` + cardType.toUpperCase() + `</div>`;
            break;
        case "epic":
            theCard += `<div class='headerEpic'>`;
            theCard += `<div class='typeEpic'>` + cardType.toUpperCase() + `</div>`;
            break;
        default:
            theCard += `<div class='headerStory'>`;
            theCard += `<div class='typeStory'>` + cardType.toUpperCase() + `</div>`;
            break;
    }

    theCard += `<div class='cardID'><a href="https://github.com/${card.owner}/${card.repoName}/issues/${card.number}" target="_blank">${card.repoName} #${card.number}</a></div>`;
    theCard += `<div class='epic'>${card.owner}: ${card.epic}</div>`;
    theCard += `<div class='labels'>${card.labels}</div>`;

    switch (cardType) {
        case "spike":
            theCard += `<div class='estimateSpike'>  </div>`;
            break;
        case "bug":
            theCard += `<div class='estimateBug'>  </div>`;
            break;
        case "epic":
            theCard += `<div class='estimateEpic'>  </div>`;
            break;
        case "forecast":
            theCard += `<div class='estimateForecast'>${card.estimate}</div>`;
            break;
        default:
            theCard += `<div class='estimateStory'>${card.estimate}</div>`;
            break;
    }

    theCard += `</div>` // header
    theCard += `<div class='descriptionArea'>`;
    theCard += `<div class='title'>${card.title}</div>`;
    theCard += `<div class='description'>${card.description.replace(/\n/g, "<br/>")}</div>`
    theCard += `</div></div>` // main, card

    return theCard;
}

