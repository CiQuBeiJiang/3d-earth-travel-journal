const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getLocations: () => ipcRenderer.invoke('get-locations'),
    saveLocations: (locations) => ipcRenderer.invoke('save-locations', locations),
    getTags: () => ipcRenderer.invoke('get-tags'),
    saveTags: (tags) => ipcRenderer.invoke('save-tags', tags),
    selectImages: () => ipcRenderer.invoke('select-images'),
    exportData: () => ipcRenderer.invoke('export-data'),
    importData: () => ipcRenderer.invoke('import-data')
});
