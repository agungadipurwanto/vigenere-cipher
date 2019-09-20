const { app, BrowserWindow } = require('electron')
const url = require('url')
const path = require('path')
const communication = require('./communication')

communication()

const initializeWindow = () => {
  let mainWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.setMenu(null)

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'src', 'encryptWindow.html'),
    protocol: 'file',
    slashes: true
  }))

  mainWindow.on('closed', () => {
    encryptWindow = null
  })
}

app.on('ready', initializeWindow)
