const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // In both dev and prod, we load from dist/index.html
  const indexPath = path.join(__dirname, '../../dist/index.html');
  mainWindow.loadFile(indexPath);
  
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Log the URL being loaded
  console.log('Loading URL:', indexPath);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
}); 