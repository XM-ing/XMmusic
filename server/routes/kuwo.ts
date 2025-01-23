import axios from 'axios'
import {Router} from 'express'


const router2 = Router()

const user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0'
const cookie = '_ga=GA1.2.1878868218.1732420481; Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1732548142,1732703932,1732810174,1733925343; HMACCOUNT=410AC3D0D46C6E98; _gid=GA1.2.417059653.1733925343; _gat=1; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1733925373; Hm_Iuvt_cdb524f42f23cer9b268564v7y735ewrq2324=dSzMDbDJNAKsbPkXhesibNfsFs74rfX2; _ga_ETPBRPM9ML=GS1.2.1733925343.10.1.1733925386.17.0.0'

const user_agent2 = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0'
const cookie2 = '_ga=GA1.2.1878868218.1732420481; Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1732548142,1732703932,1732810174,1733925343; HMACCOUNT=410AC3D0D46C6E98; _gid=GA1.2.417059653.1733925343; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1733925373; _gat=1; _ga_ETPBRPM9ML=GS1.2.1733925343.10.1.1733925842.60.0.0; Hm_Iuvt_cdb524f42f23cer9b268564v7y735ewrq2324=HrBhW7QpXF2rjmyPtRN3MtY5G3Q5B5iD'
const secret = '6b22c9ca4610395b866392e321d7c87d7c9dbfe47a8ec5324eb32aacc4b30cc8043eb287'
const headers = {
    'User-Agent': user_agent,
    'Cookie': cookie
}
const headers2 = {
    'User-Agent': user_agent2,
    'Cookie': cookie2,
    'secret': secret
}
function img_url(pic1:string,pic2:string):string{
    const imgurl1 = 'https://img2.kuwo.cn/star/albumcover/'
    const imgurl2 = 'https://img1.kuwo.cn/star/starheads/'
    if (pic1 === ''){
        return imgurl2 + pic2
    }else{
        return imgurl1 + pic1
    }
}

router2.get("/search",async function(req,res){
    const key = req.query.key
    const url = `https://kuwo.cn/search/searchMusicBykeyWord?vipver=1&client=kt&ft=music&cluster=0&strategy=2012&encoding=utf8&rformat=json&mobi=1&issubtitle=1&show_copyright_off=1&pn=0&rn=20&all=${key}`
    try{
        const response = await axios.get(url,{headers:headers})
        const result = response.data.abslist
        const infos = result
        .filter(item => item['ALBUM'] && item['DC_TARGETID'] && item['tpay'] === '0')
        .map(item => ({
            id:item['DC_TARGETID'],
            title:item['ALBUM'],
            imgurl:img_url(item['web_albumpic_short'],item['web_artistpic_short']),
            author:item['ARTIST'],
            source:'酷我',
            flag:item['tpay'] // 付费标识,1为付费,0为免费
        }))
        res.send(infos)
    }catch(err){
        const result = {
            "msg":"搜索失败"
        }
        res.send(result)
    }
})


router2.get("/play",async function(req,res){
    const mid = req.query.id
    const type = 'music'
    const url = `https://kuwo.cn/api/v1/www/music/playUrl?mid=${mid}&type=${type}&httpsStatus=1&plat=web_www&from=`
    try{
        const response = await axios.get(url,{headers:headers2})
        const result = response.data.data.url
        const audio_res = await axios.get(result,{responseType:'arraybuffer',headers:headers2})
        res.send(audio_res.data)
    }catch(err){
        const result = {
            "msg":"获取音频失败"
        }
        res.send(result)
    }
})

router2.get('/lyric',async function(req,res){
    const mid = req.query.id
    const url = `https://kuwo.cn/openapi/v1/www/lyric/getlyric?musicId=${mid}&httpsStatus=1&plat=web_www&from=`
    try{
        const response = await axios.get(url,{headers:headers})
        const result = response.data.data.lrclist
        const lyric = [] as any
        for (let i = 0; i < result.length; i++){
            lyric.push({
                "word":result[i].lineLyric,
                "time":result[i].time
            })
        }
        res.send(lyric)
    }catch(err){
        const result = {
            "msg":"获取歌词失败"
        }
        res.send(result)
    }
})






module.exports = router2