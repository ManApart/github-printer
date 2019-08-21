addPrintButton = function () {
    var printButtonText = ` <button id="print-button" class="js-selected-navigation-item reponav-item" style="background:white;" >Print</button>`

    var menuBar = document.getElementsByClassName('hx_reponav')[0]
    if (menuBar) {
        menuBar.innerHTML = menuBar.innerHTML + printButtonText

        var printButton = document.getElementById("print-button")

        printButton.addEventListener('click', function () {
            printButton.style = "background:lightgray;";
            updateAndPrint()
            setTimeout(() => { printButton.style = "background:white;"; }, 3000);
        });
    }
}

updateAndPrint = function () {
    var cards = getUpdatedCards()
    if (cards.length > 0) {
        chrome.runtime.sendMessage({ "action": "print", "cards": cards }, (data) => { });
    } else {
        alert('No cards to print!')
    }
}

getUpdatedCards = function () {
    activeCardDivs = getActiveZenhubCards()
    if (activeCardDivs.length > 0) {
        cardProps = activeCardDivs.map(getZenhubCardProperties)
        console.log(cardProps)
        return cardProps
    } else {
        activeCard = getCard()
        console.log(activeCard)
        cardProps = [getGithubCardProperties(activeCard)]
        console.log(cardProps)
        return cardProps
    }
}

getActiveZenhubCards = function () {
    return Array.prototype.slice.call(document.getElementsByClassName('zhc-issue-card--multi-active'))
}

getCard = function () {
    return document.getElementById('show_issue')
}

getZenhubCardProperties = function (cardHtml) {
    var numberText = getInnerText(cardHtml.getElementsByClassName('zhc-issue-card__issue-number')[0])
    if (numberText.length > 1) {
        numberText = numberText.substr(1, numberText.length - 1)
    }

    card = {}
    card.owner = getInnerText(document.getElementsByClassName('author')[0]).toLowerCase()
    card.title = getInnerText(cardHtml.getElementsByClassName('zhc-issue-card__issue-title')[0])
    card.description = ""
    card.number = numberText
    card.repoName = getInnerText(cardHtml.getElementsByClassName('zhc-issue-card__repo-name')[0])
    card.estimate = getInnerText(cardHtml.getElementsByClassName('zhc-badge__value')[0])
    card.sprint = getInnerText(cardHtml.getElementsByClassName('zhc-issue-card__milestone__title')[0])
    card.epic = getInnerText(cardHtml.getElementsByClassName('zhc-issue-card__epics__title')[0])
    card.labels = Array.prototype.slice.call(cardHtml.getElementsByClassName('zhc-label')).map(getInnerText)

    return card
}

getGithubCardProperties = function (cardHtml) {
    urlParts = document.URL.substr(19, document.URL.length).split("/")

    var numberText = urlParts[3]
    if (numberText.length > 1) {
        numberText = numberText.substr(1, numberText.length - 1)
    }

    var epicText = getInnerText(cardHtml.getElementsByClassName('sidebar-zh-epic')[0].children[0].children[1])
    if (epicText == "Not inside an Epic") {
        epicText = ""
    }

    var labelTexts = Array.prototype.slice.call(cardHtml.getElementsByClassName('js-issue-labels')).map(getInnerText)
    if (labelTexts.length == 1 && labelTexts[0] == "None yet") {
        labelTexts = ""
    }

    card = {}
    card.owner = urlParts[0]
    card.title = getInnerText(cardHtml.getElementsByClassName('gh-header-title')[0].children[0])
    card.description = getInnerText(cardHtml.getElementsByClassName('comment-body')[0])
    card.number = numberText
    card.repoName = urlParts[1]
    card.estimate = getInnerText(cardHtml.getElementsByClassName('js-zh-estimate-infobar-item-wrapper')[0])
    card.sprint = getInnerText(cardHtml.getElementsByClassName('milestone-name ')[0])
    card.epic = epicText
    card.labels = labelTexts

    return card
}

getInnerText = function (div) {
    if (div) {
        return div.innerText
    }
    return ""
}

addPrintButton()