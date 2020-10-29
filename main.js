// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, net} = require('electron')
const logger = require('electron-log')
const path = require('path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('src/index.html')
  mainWindow.webContents.openDevTools()

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const win = createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('get-issue-infor', function(event, object) {
  const request = net.request({ 
    method: 'GET', 
    protocol: 'http:', 
    hostname: object.host_name, 
    path: `/issues.json?issue_id=${object.issue_id}&key=${object.api_key}`,
    redirect: 'follow'
  });
  request.on('response', (response) => { 
    console.log(`STATUS: ${response.statusCode}`); 
    console.log(`HEADERS: ${JSON.stringify(response.headers)}`); 
  
    response.on('data', (chunk) => { 
        console.log(`BODY: ${chunk}`)
        event.sender.send('parse-issue-info', chunk.toString())
        console.log("DONE")
    }); 
  }); 
  request.on('finish', () => { 
    console.log('Request is Finished') 
  }); 
  request.on('abort', () => { 
    console.log('Request is Aborted') 
    logger.debug("Abort")
  }); 
  request.on('error', (error) => { 
    console.log(`ERROR: ${JSON.stringify(error)}`)
    logger.debug(`Error: ${error}`)
    event.sender.send('get-issue-error', error.toString())
  }); 
  request.on('close', (error) => { 
    console.log('Last Transaction has occured') 
  }); 
  request.setHeader('Content-Type', 'application/json'); 
  request.end(); 
})