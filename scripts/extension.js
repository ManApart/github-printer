document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('sample').addEventListener('click', function () {
        chrome.runtime.sendMessage({ "action": "print", "cards": sampleCards }, function (data) { });
    });

    document.getElementById('setKey').addEventListener('click', function () {
        let inputKey = document.getElementById("keyInput").value
        document.getElementById("keyInput").value = ""
        chrome.storage.sync.set({ apiKey: inputKey }, function () { })
    });

    document.getElementById('setOrgs').addEventListener('click', function () {
        let orgsInput = document.getElementById("orgsInput").value
        document.getElementById("orgsInput").value = ""
        chrome.storage.sync.set({ orgs: orgsInput.split(',').map(org => org.toLowerCase()) }, function () { })
    });

});

var sampleCards = [{
    owner: "smartcitiesdata",
    description: "",
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
    description: "",
    epic: "Open Source",
    estimate: "1",
    feature: "Data Platform 2.2",
    labels: [],
    number: "4",
    repoName: "charts",
    sprint: "Sprint 54",
    title: "Move reaper chart to charts repo"
}, {
    owner: "smartcolumbusos",
    description: "",
    epic: "Open Source",
    estimate: "1",
    feature: "Data Platform 2.2",
    labels: [],
    number: "44",
    repoName: "scosopedia",
    sprint: "Sprint 54",
    title: "Move valkyrie chart to charts repo"
}]