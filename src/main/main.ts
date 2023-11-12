/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserView, BrowserWindow, shell } from 'electron';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

let mainWindow: BrowserWindow | null = null;
const NAVIGATOR_HEIGHT = 52;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const setupBrowserView = () => {
  const browserView = new BrowserView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  browserView.webContents.loadURL('https://www.google.com');
  browserView.webContents.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
  );

  return browserView;
};
const createWindow = async () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.maximize();
  mainWindow.loadURL(resolveHtmlPath('index.html'));

  const browserView = setupBrowserView();
  const setBrowserViewSize = () => {
    if (mainWindow && browserView) {
      const { width: w, height: h } = mainWindow.getContentBounds();
      browserView.setBounds({
        x: 0,
        y: NAVIGATOR_HEIGHT, // Start the BrowserView below the search bar
        width: w,
        height: h - NAVIGATOR_HEIGHT, // Reduce the height of the BrowserView by the search bar height
      });
    }
  };
  setBrowserViewSize();
  mainWindow.setBrowserView(browserView);

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
    if (isDebug) {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
  });
  mainWindow.on('resize', setBrowserViewSize);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
