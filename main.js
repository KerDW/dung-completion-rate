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

    var dungeons_data = new Object();

    (async () => {
      const browser = await puppeteer.launch({headless: true});
      const page = await browser.newPage();

      // this allows printing to the console inside evaluate
      page.on('console', (log) => console[log._type](log._text));

      await page.goto(url);

      // a web privacy square shows up and depending on the latency and code execution time it effectively blocks the website so we remove that if it shows up
      privacy_square_selector = '#qc-cmp2-container'

      try{
        await page.evaluate(() => {
          let privacy_square = document.querySelector('.qc-cmp2-container');
        
          privacy_square.parentNode.removeChild(privacy_square);
        });
      } catch (err){

      }

      // get char name and covenant
      var char_name = await page.evaluate(() => 
        document.querySelector('.rio-text-shadow--heavy').innerText
      );

      // can crash in case of no covenant
      try{
        var covenant = await page.evaluate(() => 
        document.querySelector('.nowrap').innerText
        );
      } catch(err){

      }

      console.log('Clicking rows')

      // click open drop downs so I can scrape the info inside
      await page.evaluate(() => {
        let elements = document.getElementsByClassName('rio-striped');
        for (let element of elements)
            element.childNodes[0].click();
      });

      console.log('Waiting for selectors')

      var css_select = 'table.slds-max-small-table > .rio-striped > tr > td:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table > .rio-striped > tr:nth-child(1) > td:nth-child(3) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1) > span:nth-child(1)'
      
      await page.waitForSelector(css_select)

      await page.waitForTimeout(2000)

      console.log('Selecting data')

      // iterate all dungeons completed and sort info
      dungeons_data = await page.evaluate(() => {

        var timed = 0;
        var depleted = 0;
        let dungs = document.querySelectorAll('table.slds-max-small-table > .rio-striped > tr > td:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table > .rio-striped > tr:nth-child(1) > td:nth-child(3) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1) > span:nth-child(1)');

        for (let dung of dungs){
          var dung_value = dung.textContent

          // console.log(dung_value)

          if(dung_value == 'Keystone Depleted'){
            depleted++
          } else {
            timed++
          }
        }

        console.log('Sorting data')

        let dungeons = {
          total: timed + depleted,
          timed: timed,
          depleted: depleted,
          timedPercent: Number(timed*100/(timed+depleted)).toFixed(2)
        }

        return dungeons;

      });

      dungeons_data.character = char_name;
      dungeons_data.covenant = covenant;

      await browser.close();

      console.log('Browser closed')

    })().then(() => {
      event.sender.send("sendCharData", dungeons_data);
    });

  })

}

