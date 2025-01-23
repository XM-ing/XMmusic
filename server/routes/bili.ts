import axios from 'axios'
import { Router } from 'express'
import fs from 'fs'


const router = Router()

const User_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0'
const Referer = 'https://www.bilibili.com/'
const Cookie = "buvid3=6B969B71-9B3F-A3D9-E087-928F720D2CE395034infoc; b_nut=1729348695; _uuid=5B41079C2-B256-2877-5736-23E97EFDB61D07124infoc; enable_web_push=DISABLE; rpdid=|(k|k)JmJkY)0J'u~kmJlR||m; header_theme_version=CLOSE; buvid4=5BA84A9B-767A-D470-E3D0-6B9525917B9011562-024101914-cv6NSC3VHyFY0HG%2Fp5bw9Q%3D%3D; bp_t_offset_2029129981=1007339452055420928; fingerprint=bc404a9ae3c12bcd345bf0cd4c0d65f9; buvid_fp_plain=undefined; buvid_fp=c01586ffa0f957538f1a0b5529fd9375; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzQxODQzNDYsImlhdCI6MTczMzkyNTA4NiwicGx0IjotMX0.y8D8NuKa-GVoM1GlmiYeBydemEE7__cXqKXtgnC1ygc; bili_ticket_expires=1734184286; b_lsid=BFD105532_193BAA948AC; bsource=search_bing; home_feed_column=5; browser_resolution=1528-786; CURRENT_FNVAL=4048; sid=6v73kb16"
const Origin = 'https://search.bilibili.com'


const headers1 = {
    'User-Agent': User_agent,
    'Referer': Referer,
    'Cookie': Cookie,
    'Origin': Origin,
}
const headers2 = {
    'User-Agent': User_agent,
    'Referer': Referer,
    'Cookie': Cookie,
    'Origin': "https://www.bilibili.com",
}


router.get("/search",async function(req,res){
    const key = req.query.key
    const url = `https://api.bilibili.com/x/web-interface/wbi/search/all/v2?__refresh__=true&_extra=&context=&page=1&page_size=42&order=&pubtime_begin_s=0&pubtime_end_s=0&duration=&from_source=&from_spmid=333.337&platform=pc&highlight=1&single_column=0&keyword=${key}&qv_id=9fZpoJnCwy7DwyGBxyrrSCXdabZeA4ne&ad_resource=5646&source_tag=3&web_location=1430654&w_rid=4a4d28a1dde1a4a869368fa2c8962059&wts=1734003518`
    try{
        const request = await axios.get(url,{headers:headers1})
        const result = request.data.data.result[11].data
        const infos = result
        .filter(item => item['pic'] && item['bvid']) // 过滤掉没有封面和bvid的视频
        .map(item => ({
            id:item['bvid'],
            title:item['title'].replace(/<em.*?>(.*?)<\/em>/g,'$1'),
            imgurl:`http:${item['pic']}`,
            author:item['author'],
            source:"b站"
        }))
        res.send(infos)
    }catch(err){
        const result = {
            "message":"搜索失败",
        }
        res.send(result)
    }
})
router.get("/play",async function(req,res){
    const id = req.query.id
    const url = `https://www.bilibili.com/video/${id}/`
    try{
        const request = await axios.get(url,{headers:headers2})
        const text = request.data.match(/<script>window\.__playinfo__=(.*?)<\/script>/)
        if (text && text[1]){
            const result = JSON.parse(text[1])
            const audio_url = result['data']['dash']['audio'][0]['baseUrl']
            const audio_res = await axios.get(audio_url,{responseType:'arraybuffer',headers:headers2})
            res.send(audio_res.data)
        }
    }catch(err){
        res.send({"message":"获取音频失败"})
    }
})

module.exports = router









