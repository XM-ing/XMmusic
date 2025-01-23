const {contextBridge,ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('electronAPI',{
    minWindow:() => ipcRenderer.send('min-window'),
    closeWindow:() => ipcRenderer.send('close-window'),
    isMaximized:() => ipcRenderer.invoke('is-maximized'),
    maxWindow:() => ipcRenderer.invoke('max-window'),
    unmaxWindow:() => ipcRenderer.invoke('unmax-window'),
})