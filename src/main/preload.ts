import { contextBridge, ipcRenderer } from 'electron';

const exposedAPIs = {
  whatever: (somedata: string) => ipcRenderer.send('some-data', somedata),
};
contextBridge.exposeInMainWorld('electron', exposedAPIs);

export type BrowserMethods = typeof exposedAPIs;
