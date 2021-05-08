const { remote, ipcRenderer } = require('electron');

function searchChar(){
    event.preventDefault();

    character = document.getElementById('character').value
    server = document.getElementById('server').value
    region = document.getElementById('region').value

    url = 'https://raider.io/characters/' + region + '/' + server + '/' + character;

    ipcRenderer.send('searchChar', url)

}