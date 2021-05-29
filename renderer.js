const { remote, ipcRenderer } = require('electron');

function searchChar(){
    event.preventDefault();

    url = document.getElementById('rurl').value;

    document.getElementById("loading").style.display = 'block';
    
    document.getElementById('charName').style.display = 'none';
    document.getElementById('covenant').style.display = 'none';
    document.getElementById('dungeonsInfo').style.display = 'none';

    ipcRenderer.send('searchChar', url)

}

ipcRenderer.on("sendCharData", (event, dungeons_data) => {

    document.getElementById('charName').style.display = 'block';
    document.getElementById('covenant').style.display = 'block';
    document.getElementById('dungeonsInfo').style.display = 'block';

    // document.getElementById('charName').innerHTML = "Character: " + dungeons.character;
    // document.getElementById('covenant').innerHTML = "Covenant: " + dungeons.covenant;

    for (let dungeon_data of dungeons_data) {
        document.getElementById('dungeonsInfo').innerHTML = document.getElementById('dungeonsInfo').innerHTML + dungeon_data.name + " timed percent: " + dungeon_data.timed_percent + "<br>"
    }

    document.getElementById("loading").style.display = 'none';
    document.getElementById("notFound").style.display = 'none';

})

ipcRenderer.on("sendNotFound", (event) => {

    document.getElementById("loading").style.display = 'none';
    document.getElementById("notFound").style.display = 'block';

})