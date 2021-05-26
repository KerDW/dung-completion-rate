const { remote, ipcRenderer } = require('electron');

function searchChar(){
    event.preventDefault();

    url = document.getElementById('rurl').value;

    document.getElementById("loading").style.display = 'block';
    
    document.getElementById('charName').style.display = 'none';
    document.getElementById('covenant').style.display = 'none';
    document.getElementById('completedDungs').style.display = 'none';
    document.getElementById('timedDungs').style.display = 'none';
    document.getElementById('depletedDungs').style.display = 'none';
    document.getElementById('timedPercent').style.display = 'none';
    document.getElementById('timedPercent').style.display = 'none';

    ipcRenderer.send('searchChar', url)

}

ipcRenderer.on("sendCharData", (event, dungeons) => {

    document.getElementById('charName').style.display = 'block';
    document.getElementById('covenant').style.display = 'block';
    document.getElementById('completedDungs').style.display = 'block';
    document.getElementById('timedDungs').style.display = 'block';
    document.getElementById('depletedDungs').style.display = 'block';
    document.getElementById('timedPercent').style.display = 'block';
    document.getElementById('timedPercent').style.display = 'block';

    document.getElementById('charName').innerHTML = "Character: " + dungeons.character;
    document.getElementById('covenant').innerHTML = "Covenant: " + dungeons.covenant;
    document.getElementById('completedDungs').innerHTML = "Dungeons completed: " + dungeons.total;
    document.getElementById('timedDungs').innerHTML = "Dungeons timed: " + dungeons.timed;
    document.getElementById('depletedDungs').innerHTML = "Dungeons depleted: " + dungeons.depleted;
    document.getElementById('timedPercent').innerHTML = "Timed percent: " + dungeons.timedPercent + "%";
    document.getElementById('timedPercent').innerHTML = "Timed percent: " + dungeons.timedPercent + "%";

    document.getElementById("loading").style.display = 'none';

})