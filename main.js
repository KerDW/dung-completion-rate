const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const puppeteer = require('puppeteer')
const utf8 = require('utf8');

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadFile('index.html')

  win.webContents.openDevTools();

  ipcMain.on("searchChar", (event, url) => {

    var dungeons = new Object();

    (async () => {
      const browser = await puppeteer.launch({headless: true});
      const page = await browser.newPage();
      await page.goto(url);

      console.log(url)

      // a web privacy square shows up and depending on the latency and code execution time it effectively blocks the website so we remove that if it shows up
      privacy_square_selector = '#qc-cmp2-container'

      try{
        await page.evaluate(() => {
          let privacy_square = document.querySelector('.qc-cmp2-container');
        
          privacy_square.parentNode.removeChild(privacy_square);
        });
      } catch (err){

      }

      const char_name = await page.evaluate(() => 
        document.querySelector('.rio-text-shadow--heavy').innerText
      );

      console.log(char_name)

      console.log('Clicking rows')

      await page.evaluate(() => {
        let elements = document.getElementsByClassName('rio-striped');
        for (let element of elements)
            element.childNodes[0].click();
      });

      console.log('Waiting for selectors')

      css_select = 'table.slds-max-small-table > .rio-striped > tr > td:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table > .rio-striped > tr:nth-child(1) > td:nth-child(3) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1) > span:nth-child(1)'
      
      await page.waitForSelector(css_select)

      console.log('Selecting data')
      
      dungs = await page.$$(css_select);

      console.log('Sorting data')

      var timed = 0;
      var depleted = 0;

      for(dung of dungs) {

        dung = await dung.getProperty('textContent')
        dung = await dung.jsonValue()

        // console.log(dung)

        if(dung == 'Keystone Depleted'){
          depleted++
        } else {
          timed++
        }
      }

      await browser.close();

      console.log('Browser closed')

      dungeons = {
        character: char_name,
        total: timed + depleted,
        timed: timed,
        depleted: depleted,
        timedPercent: Number(timed*100/(timed+depleted)).toFixed(2)
      }

    })().then(() => {
      event.sender.send("sendCharData", dungeons);
    });

  })

}

