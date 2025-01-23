import { app, BrowserWindow,ipcMain } from "electron"
import path from "path"
import getPort,{portNumbers} from "get-port"



const {startServer,stopServer} = require(path.join(__dirname,"./server/server.js"))

// 请求模块
function ready(mainwin){
    ipcMain.on('min-window',() => mainwin.minimize())
    ipcMain.on('close-window',() => mainwin.close())
    ipcMain.handle('is-maximized',() => mainwin.isMaximized())
    ipcMain.handle('max-window',() => mainwin.maximize())
    ipcMain.handle('unmax-window',() => mainwin.unmaximize())
}


const createWindow = () => {
    const win = new BrowserWindow({
        autoHideMenuBar: true,
        width:1200,
        height:800,
        minWidth:1200,
        minHeight:800,
        frame:false,
        webPreferences: {
        contextIsolation: true, // 是否开启隔离上下文
        nodeIntegration: true, // 渲染进程使用Node API
        preload: path.join(__dirname, "./preload.js"), // 需要引用js文件
        },
    })

    // 如果打包了，渲染index.html
    if (process.env.NODE_ENV !== 'development') {
        win.loadFile(path.join(__dirname, "./index.html"))
        win.webContents.openDevTools()
    } else {
        let url = "http://localhost:5173" // 本地启动的vue项目路径。注意：vite版本3以上使用的端口5173；版本2用的是3000
        win.loadURL(url)
        win.webContents.openDevTools()
    }

    // 窗口事件监听
    ready(win)


}

app.whenReady().then(async () => {
    // 启动本地服务
    const port = await getPort({port:portNumbers(3000,3100)})
    await startServer(port)

    // 创建窗口
    createWindow()
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// 关闭窗口
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
        stopServer()
    }
}) 