const { remote } = require('electron');

function searchChar(){
    event.preventDefault();

    character = document.getElementById('character').value
    server = document.getElementById('server').value
    region = document.getElementById('region').value

    site = 'https://raider.io/characters/' + region + '/' + server + '/' + character;

    // (async () => {
    //     const browser = await puppeteer.launch();
    //     const page = await browser.newPage();

    //     await page.goto(site);
      
    //     await browser.close();
    //   })();

}