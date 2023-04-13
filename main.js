const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron')
const path = require('path');

let win

const createWindow = () => {

    win = new BrowserWindow({
      width: 800,
      height: 600,
      title: "MyPet",
      icon: path.join(__dirname, '/ikona.icns'),
      webPreferences: { // nastavitve za webview
        nodeIntegration: true, // omogoci node.js v webview
        contextIsolation: false,
        preload: path.join(__dirname, 'preload.js') // skripta, ki se izvede v webview
    }
    })

    win.setTitle("MyPet");

    win.on('page-title-updated', function(e) {
        e.preventDefault()
    });


    app.setName("MyPet")
  
    win.loadFile('index.html')

    ipcMain.handle('dark-mode:system', () => {
        nativeTheme.themeSource = 'system'
    })

}

app.whenReady().then(() => {
    globalShortcut.register('Alt+CommandOrControl+K', () => {
        win.webContents.send('pocistiTabelo');
    })
    globalShortcut.register('Alt+CommandOrControl+L', () => {
        win.webContents.send('posodobiTabelo');
    })
    globalShortcut.register('Alt+CommandOrControl+O', () => {
        win.webContents.send('fetchajPodatke');
    })
}).then(createWindow)

app.on('window-all-closed', () => {
if (process.platform !== 'darwin') {
    app.quit()
}
})

app.on('activate', () => {
if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
}
})