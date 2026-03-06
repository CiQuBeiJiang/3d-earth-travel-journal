const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getLocations: () => ipcRenderer.invoke('get-locations'),
    saveLocations: (locations) => ipcRenderer.invoke('save-locations', locations)
});
