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

    // durl = utf8.encode(url)

    // console.log(durl);

    (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);

      console.log('Getting rows to click')

      tableRows = await page.$$('table.slds-max-small-table > tbody:nth-child(2) > tr:nth-child(1)')

      console.log('Clicking rows')

      for(let tableRow of tableRows){
        tableRow.click()
      }

      console.log('Waiting for selectors')

      css_select = 'table.slds-max-small-table > tbody:nth-child(2) > tr:nth-child(2) > td:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table > .rio-striped > tr:nth-child(1) > td:nth-child(3) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1) > span:nth-child(1)'
      
      await page.waitForSelector(css_select)
      
      // css_select = 'table > tbody > tr > td:nth-child(3) > div > div:nth-child(1) > span > span > span' this is the outer table

      console.log('Selecting data')
      
      dungs = await page.$$(css_select);

      // console.log(dungs)

      for(let dung of dungs) {

        dung = await dung.getProperty('innerText')
        dung = await dung.jsonValue()

        console.log(dung)
      }

      // for (const element of inputElements) {
      //         let inputValue;

      //         inputValue = await page.evaluate(el => el.textContent, inputValue)

      //         console.log(inputValue)
      // }

    
      await browser.close();
    })();


    //event.sender.send("sendCharData", charData);

  })

}

