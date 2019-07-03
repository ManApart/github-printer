document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('sample').addEventListener('click', function () {
        chrome.runtime.sendMessage({ "action": "print", "cards": sampleCards }, function (data) { });
    });

});


var sampleCards = [{
    owner: "smartcitiesdata",
    epic: "Core Enhancements",
    estimate: "",
    feature: "Data Platform 2.2",
    labels: ["spike"],
    number: "42",
    repoName: "project",
    sprint: "Sprint 54",
    title: "Presto SQL Injection"
}, {
    owner: "smartcitiesdata",
    epic: "Open Source",
    estimate: "1",
    feature: "Data Platform 2.2",
    labels: [],
    number: "4",
    repoName: "charts",
    sprint: "Sprint 54",
    title: "Move reaper chart to charts repo"
}, {
    owner: "smartcitiesdata",
    epic: "Open Source",
    estimate: "1",
    feature: "Data Platform 2.2",
    labels: [],
    number: "5",
    repoName: "charts",
    sprint: "Sprint 54",
    title: "Move valkyrie chart to charts repo"
}]