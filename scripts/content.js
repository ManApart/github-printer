chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("something happening from the extension");

    if (request.action == "insert") {
        addPrintButton()
    }


    activeCardDivs = getActiveCards()
    cardProps = activeCardDivs.map(getCardProperties)
    console.log(cardProps)

    sendResponse({ cards: cardProps });
});

updateCards = function () {
    activeCardDivs = getActiveCards()
    cardProps = activeCardDivs.map(getCardProperties)
    console.log(cardProps)
    return cardProps
}

getActiveCards = function () {
    return Array.prototype.slice.call(document.getElementsByClassName('zhc-issue-card--multi-active'))
}

getCardProperties = function (cardHtml) {
    card = {}
    card.title = getInnerText(cardHtml.getElementsByClassName('zhc-issue-card__issue-title')[0])
    card.number = getInnerText(cardHtml.getElementsByClassName('zhc-issue-card__issue-number')[0])
    card.repoName = getInnerText(cardHtml.getElementsByClassName('zhc-issue-card__repo-name')[0])
    card.estimate = getInnerText(cardHtml.getElementsByClassName('zhc-badge__value')[0])
    card.sprint = getInnerText(cardHtml.getElementsByClassName('zhc-issue-card__milestone__title')[0])
    card.epic = getInnerText(cardHtml.getElementsByClassName('zhc-issue-card__epics__title')[0])
    card.feature = getInnerText(cardHtml.getElementsByClassName('zhc-issue-card__release-title')[0])

    card.labels = Array.prototype.slice.call(cardHtml.getElementsByClassName('zhc-label')).map(getInnerText)

    return card
}

getInnerText = function (div) {
    if (div) {
        return div.innerText
    }
    return ""
}


addPrintButton = function () {
    console.log("insert action");

    var printButtonText = ` <div class="zhc-menu-bar-item"><button id="print-button" class="zhc-btn zhc-btn--has-text zhc-btn--secondary" type="button"><div class="zhc-btn__content "><span>Print</span></div></button></div>`

    var menuBar = document.getElementsByClassName('zhc-menu-bar')[0]
    console.log(menuBar)
    menuBar.innerHTML = menuBar.innerHTML + printButtonText

    var printButton = document.getElementById("print-button")

    printButton.addEventListener('click', function () {
        updateAndPrint()
    });

}


updateAndPrint = function () {
    console.log('update and print')
    var cards = updateCards()
    chrome.runtime.sendMessage({ "action": "print", "cards": cards }, function (data) {
    });
}