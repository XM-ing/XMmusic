import express from "express"
import appPath from "path"
import cookieParser from "cookie-parser"
import logger from "morgan"
import cors from "cors"

//加载路由文件
const apiBili = require(appPath.join(__dirname,"./routes/bili.js"))
const apiKuwo = require(appPath.join(__dirname,"./routes/kuwo.js"))
const cache = require(appPath.join(__dirname,"./routes/cache.js"))


const app:any = express()

// 解决跨域
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())

// 使用路由
app.use("/api/bili",apiBili)
app.use('/api/kuwo',apiKuwo)
app.use("/cache",cache)

const http = require("http")
const server = http.createServer(app)

// 启动服务器
async function startServer(port){
    app.set("port",port)
    return new Promise((resolve,reject) => {
        server.listen(port,() => {
            console.log(`Server running on port ${port}`)
            resolve(server)
        })
        server.on("error",(error) => {
            reject(error)
        })
    })
}

// 关闭服务器
async function stopServer(){
    return new Promise((resolve) => {
        server.close(() => {
            console.log("Server closed")
            resolve("")
        })
    })
}

// 导出启动和关闭服务器的函数
export{
    startServer,
    stopServer
}