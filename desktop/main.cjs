const { app, BrowserWindow } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;

function createWindow() {
  try {
    const win = new BrowserWindow({
      width: 1280,
      height: 800,
      autoHideMenuBar: true,
      webPreferences: {
        contextIsolation: true,
      },
    });

    if (isDev) {
      win.loadURL('http://localhost:5173');
    } else {
      win.loadFile(path.join(__dirname, '../dist/index.html'));
    }
  } catch (error) {
    console.error('Error creating window:', error);
  }
}

app.whenReady().then(createWindow).catch(console.error);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});