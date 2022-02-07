const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const fs = require("fs");
const path = require('path');

let mainWindow;

function createWindow () {
  const win = new BrowserWindow({
    width: 520,
    height: 400,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false, // protect against prototype pollution
      enableRemoteModule: true, // turn off remote
      preload: path.join(__dirname, "preload.js") // use a preload script
    }
  })

  win.loadFile(path.join(__dirname, "views/index.html"));
  // Menu
  const mainMenu = Menu.buildFromTemplate(templateMenu);
  // Set The Menu to the Main Window
  Menu.setApplicationMenu(mainMenu);
  // If we close main Window the App quit
  win.on('closed', () => {
    app.quit();
  });
}

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

// Ipc Renderer Events
ipcMain.on("toMain", (event, args) => {
  fs.readFile("path/to/file", (error, data) => {
    // Do something with file contents

    // Send result back to renderer process
    win.webContents.send("fromMain", responseObj);
  });
});


// Menu Template
const templateMenu = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Exit',
        accelerator: process.platform == 'darwin' ? 'command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];

// if you are in Mac, just add the Name of the App
if (process.platform === 'darwin') {
  templateMenu.unshift({
    label: app.getName(),
  });
};

// Developer Tools in Development Environment
if (process.env.NODE_ENV !== 'production') {
  templateMenu.push({
    label: 'DevTools',
    submenu: [
      {
        label: 'Show/Hide Dev Tools',
        accelerator: process.platform == 'darwin' ? 'Comand+D' : 'Ctrl+D',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}