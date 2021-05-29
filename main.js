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

  //win.webContents.openDevTools();

  ipcMain.on("searchChar", (event, url) => {

    var dungeons_data = new Array();
    var found;

    (async () => {
      const browser = await puppeteer.launch({headless: true});
      const page = await browser.newPage();

      // this allows printing to the console inside evaluate
      page.on('console', (log) => console[log._type](log._text));

      await page.goto(url);
      
      // check for 404 modal
      found = await page.$('.slds-modal__container') === null;

      if(found){

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

          var dungeons_data = new Array();
          var timed = 0;
          var depleted = 0;
          let dung_results = document.querySelectorAll('table.slds-max-small-table > .rio-striped > tr > td:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table > .rio-striped > tr:nth-child(1) > td:nth-child(3) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1) > span:nth-child(1)');
          // get all dungeon names and extract their names
          let dung_names = Array.prototype.map.call(document.querySelectorAll('tbody.rio-striped > tr:nth-child(1) > td:nth-child(1) > span:nth-child(2)'), function(t) { return t.textContent.trimEnd(); });
          
          // add dungeon object for each dungeon
          for(let dung_name of dung_names){

            let dungeon = {
              name: dung_name,
              total: 0,
              timed: 0,
              depleted: 0
            }

            dungeons_data.push(dungeon)
          }
          
          // find runs for each dungeon and add data
          for (let dung_result of dung_results){
            var dung_result_value = dung_result.textContent
            var dungeon_name = dung_result.closest('.rio-striped').parentElement.closest('.rio-striped').querySelector('tr:nth-child(1) > td:nth-child(1) > span').textContent.trimEnd();

            // find the matching array dungeon object and fill values
            for (let dungeon_data of dungeons_data) {
              if(dungeon_data.name === dungeon_name){
                dungeon_data.total++
                if(dung_result_value == 'Keystone Depleted'){
                  dungeon_data.depleted++
                } else {
                  dungeon_data.timed++
                }
              }
            }

            // add total object to the beginning with the total of dungeons

            // calculate timed percent after knowing the values
            for (let dungeon_data of dungeons_data) {
              dungeon_data.timed_percent = Number(dungeon_data.timed*100/(dungeon_data.timed+dungeon_data.depleted)).toFixed(2) + "%";
            }

          }

          return dungeons_data;

        });

        // dungeons_data.character = char_name;
        // dungeons_data.covenant = covenant;

      }

      await browser.close();

      console.log('Browser closed')

    })().then(() => {
      
      if(found){
        event.sender.send("sendCharData", dungeons_data);
      } else {
        event.sender.send("sendNotFound");
      }
    });

  })

}

