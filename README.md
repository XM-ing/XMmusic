# project

要使用该源代码，应对vue，electron，vite，nodejs等有一个初步的了解。


# 1.准备工作

首先是配置nodejs的环境，可以在b站上查询

其次是使用别人的vue项目，可以在网上搜

然后安装必要的依赖，国内环境推荐使用cnpm来代替npm，可以用`npm install cnpm`来安装
```bash
// 初始化
npm install

//安装electron
npm install electron -D
//打包工具
npm install electron-builder -D
//开发工具
npm install electron-devtools-installer -D
//集成Vite和Electron，方便后续在渲染进程中使用Node API或Electron API
npm install vite-plugin-electron -D
npm install vite-plugin-electron-renderer -D
 
//快速删除某些文件和文件夹
npm install rimraf -D    

```
其余的依赖可以在package.json里查看来安装，这里不一一展示了。

可以边用`npm run dev`来运行程序，报错了问ai就行。
打包命令是`npm run build`# project

要使用该源代码，应对vue，electron，vite，nodejs等有一个初步的了解。
