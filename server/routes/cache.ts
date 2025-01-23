import { Router } from 'express';
import fs from 'fs';
import path from 'path';
const { app } = require('electron'); // 引入 Electron 的 app 方法

const router0 = Router();

// 确定文件路径，存储在 appData 的 Local 目录下
const filePath = path.join(app.getPath('userData'), 'mycache', 'playlist.json');

// 确保目标目录存在
async function ensureDirectoryExists(filePath) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        await fs.promises.mkdir(dir, { recursive: true });
    }
}

router0.get('/playlist/write', async function(req, res) {
    try {
        await ensureDirectoryExists(filePath);

        // 确保文件存在
        try {
            await fs.promises.access(filePath);
        } catch (err) {
            await fs.promises.writeFile(filePath, JSON.stringify([]), { encoding: 'utf-8' });
        }

        // 读取现有数据
        const data = await fs.promises.readFile(filePath, 'utf-8');
        const playlist = JSON.parse(data);
        const existingItem = playlist.find(item => item.id === req.query.id);
        if (existingItem) {
            return res.send({ "msg": '歌曲已存在' });
        }

        // 追加新数据
        playlist.push(req.query);
        await fs.promises.writeFile(filePath, JSON.stringify(playlist, null, 2), { encoding: 'utf-8' });
        res.send({ "msg": '写入成功', "data": playlist });
    } catch (error) {
        console.error('写入文件失败:', error);
        res.status(500).send({ '服务器错误': error });
    }
});

router0.get('/playlist/read', async function(req, res) {
    await ensureDirectoryExists(filePath);
    try {
        const data = await fs.promises.readFile(filePath, 'utf-8');
        const playlist = JSON.parse(data);
        res.send({ "msg": '读取成功', "data": playlist });
    } catch (error) {
        res.status(500).send('服务器错误');
    }
});

router0.get('/playlist/delete', async function(req, res) {
    try {
        const index = parseInt(req.query.index); // 确保索引为数字
        
        // 读取现有数据
        const data = await fs.promises.readFile(filePath, 'utf-8');
        const playlist = JSON.parse(data);

        // 检查索引是否有效
        if (index >= 0 && index < playlist.length) {
            playlist.splice(index, 1); // 删除指定索引的数据
            await fs.promises.writeFile(filePath, JSON.stringify(playlist, null, 2), { encoding: 'utf-8' });
            res.send({ "msg": '删除成功', "data": playlist });
        } else {
            res.status(400).send({ "msg": '索引无效' }); // 返回400错误
        }
    } catch (error) {
        console.error('删除文件失败:', error);
        res.status(500).send({ '服务器错误': error });
    }
});

module.exports = router0;
