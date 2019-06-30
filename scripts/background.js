
var origSampleData = [{
    epic: "Core Enhancements",
    estimate: "",
    feature: "Data Platform 2.2",
    labels: ["spike"],
    number: "#42",
    repoName: "project",
    sprint: "Sprint 54",
    title: "Presto SQL Injection"
}, {
    epic: "Open Source",
    estimate: "1",
    feature: "Data Platform 2.2",
    labels: [],
    number: "#4",
    repoName: "charts",
    sprint: "Sprint 54",
    title: "Move reaper chart to charts repo"
}, {
    epic: "Open Source",
    estimate: "1",
    feature: "Data Platform 2.2",
    labels: [],
    number: "#5",
    repoName: "charts",
    sprint: "Sprint 54",
    title: "Move valkyrie chart to charts repo"
}]

var sampleData = origSampleData

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('messgae recieved')
    if (request.action == "reset") {
        sampleData = origSampleData
    }
    if (request.action == "print") {
        sampleData = request.cards
        chrome.tabs.create({ url: chrome.extension.getURL("print_view.html") });
    }

    sendResponse(sampleData);
});