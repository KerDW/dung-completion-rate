const { remote, ipcRenderer } = require('electron');

function searchChar(){
    event.preventDefault();

    // character = document.getElementById('character').value
    // server = document.getElementById('server').value
    // region = document.getElementById('region').value

    // url = 'https://raider.io/characters/' + region + '/' + server + '/' + character;

    url = document.getElementById('rurl').value;

    ipcRenderer.send('searchChar', url)

}

ipcRenderer.on("sendCharData", (event, dungeons) => {

    document.getElementById('charName').innerHTML = "Character: " + dungeons.character;
    document.getElementById('covenant').innerHTML = "Covenant: " + dungeons.covenant;
    document.getElementById('completedDungs').innerHTML = "Dungeons completed: " + dungeons.total;
    document.getElementById('timedDungs').innerHTML = "Dungeons timed: " + dungeons.timed;
    document.getElementById('depletedDungs').innerHTML = "Dungeons depleted: " + dungeons.depleted;
    document.getElementById('timedPercent').innerHTML = "Timed percent: " + dungeons.timedPercent + "%";
    document.getElementById('timedPercent').innerHTML = "Timed percent: " + dungeons.timedPercent + "%";

    console.log(dungeons)

})