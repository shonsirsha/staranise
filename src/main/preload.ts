import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron';

const exposedAPIs = {
  loadURL: (url: string) => ipcRenderer.send('load-url', url),
  onUrlChange: (callback: (event: IpcRendererEvent, url: string) => void) => {
    ipcRenderer.on('url-changed', callback);
  },
  removeUrlChangeListener: (
    callback: (event: IpcRendererEvent, url: string) => void,
  ) => {
    ipcRenderer.removeListener('url-changed', callback);
  },
};
contextBridge.exposeInMainWorld('electron', exposedAPIs);

export type BrowserMethods = typeof exposedAPIs;
