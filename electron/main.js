import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadURL('http://localhost:5500'); // For development
  // win.loadFile(path.join(__dirname, 'build/index.html')); // Uncomment for production build
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});