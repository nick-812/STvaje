const { app, Browserwindow } = require('electron')
const path = require('path')

function createWindow() {
    const win = new BrowserWindow({
        width: 800, 
        helght: 600,
        webPreferences: { // nastavitve za webview
            nodeIntegration: true, // omogoci node.js v webview
            preload: path.join(__dirname, 'preload.js') // skripta, ki se izvede v webview
        }
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => { // ko je electron pripravlien
    createwindow() // ustvari novo okno

    app.on ('activate', () => { // ko je aplikacija aktivirana (klik na ikono, predvsem na macOS)
        if (Browserwindow.getAllwindows().length === 0) {
            createwindow() // ustvari novo okno
        } // ce ni nobeneaa odorteaa okna
    })
})

app.on('window-all-closed', () => { // ko so vsa okna zaprta
    if (process.platform !== 'darwin') { // ¿e platforma ni macOS, kjer je aplikacija aktivna tudi, ¿e je okno zaprto
        app.quit() // zaori alikaciio
    }
})