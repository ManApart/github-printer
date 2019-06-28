
var sampleData = [{
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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "update") {
        console.log('background')
        console.log(request)
        sampleData = request.cards
    }

    sendResponse(sampleData);
});