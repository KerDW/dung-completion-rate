const { remote, ipcRenderer } = require('electron');

function searchChar(){
    event.preventDefault();

    url = document.getElementById('rurl').value;

    document.getElementById("loading").style.display = 'block';
    document.getElementById("notFound").style.display = 'none';
    document.getElementById("searchButton").style.display = 'none';
    document.getElementById("searchButton").disabled = true;
    
    document.getElementById('charName').style.display = 'none';
    document.getElementById('covenant').style.display = 'none';
    document.getElementById('dungeonsInfo').innerHTML = '';

    ipcRenderer.send('searchChar', url)

}

ipcRenderer.on("charData", (event, dungeons_data) => {

    document.getElementById('charName').style.display = 'block';
    document.getElementById('covenant').style.display = 'block';
    document.getElementById('dungeonsInfo').style.display = 'block';

    // document.getElementById('charName').innerHTML = "Character: " + dungeons.character;
    // document.getElementById('covenant').innerHTML = "Covenant: " + dungeons.covenant;

    for (let i = 0; i < dungeons_data.length; i++) {
        document.getElementById('dungeonsInfo').innerHTML = document.getElementById('dungeonsInfo').innerHTML + dungeons_data[i].name + " total runs: " + dungeons_data[i].total + ", depleted: " + dungeons_data[i].depleted + ", timed percent: " + dungeons_data[i].timed_percent + "%<br>"
        if(i == 0) document.getElementById('dungeonsInfo').innerHTML = document.getElementById('dungeonsInfo').innerHTML + "<br>"
    }

    document.getElementById("loading").style.display = 'none';
    document.getElementById("searchButton").style.display = 'block';
    document.getElementById("searchButton").disabled = false;

})

ipcRenderer.on("notFound", (event) => {

    document.getElementById("loading").style.display = 'none';
    document.getElementById("searchButton").style.display = 'block';
    document.getElementById("searchButton").disabled = false;

})

