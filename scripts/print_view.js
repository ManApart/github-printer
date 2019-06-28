document.addEventListener('DOMContentLoaded', function () {
    console.log('page loaded')

    chrome.runtime.sendMessage({ "action": "getData" }, function (cards) {
        console.log(cards)
        document.body.innerHTML = cards.map(createDiv);
    });

})

function createDiv(card) {
    return `<div>
    <div class='title'>${card.title}</div>
    <div class='number'>${card.number}</div>
    <div class='repoName'>${card.repoName}</div>
    <div class='estimate'>${card.estimate}</div>
    <div class='sprint'>${card.sprint}</div>
    <div class='epic'>${card.epic}</div>
    <div class='feature'>${card.feature}</div>
    <div class='labels'>${card.labels}</div>
    </div>`
}

