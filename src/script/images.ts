import {ref} from 'vue';
export const images = {
    dark: {
        light: new URL('@/../public/images/dark/light.png', import.meta.url).href,
        play:new URL('@/../public/images/dark/play.png', import.meta.url).href,
        pause:new URL('@/../public/images/dark/pause.png', import.meta.url).href,
        like:new URL('@/../public/images/dark/like.png', import.meta.url).href,
        collect:new URL('@/../public/images/dark/collect.png', import.meta.url).href,
        download:new URL('@/../public/images/dark/download.png', import.meta.url).href,
        play2:new URL('@/../public/images/dark/play2.png', import.meta.url).href,
        delete:new URL('@/../public/images/dark/delete.png', import.meta.url).href,
        loopone:new URL('@/../public/images/dark/loopone.png', import.meta.url).href,
        looplist:new URL('@/../public/images/dark/looplist.png', import.meta.url).href,
        random:new URL('@/../public/images/dark/random.png', import.meta.url).href,
        up_down:new URL('@/../public/images/dark/up_down.png', import.meta.url).href,

    },
    light: {
        dark: new URL('@/../public/images/light/dark.png', import.meta.url).href,
    },
    back:{
        back1:new URL('@/../public/images/back/1.png', import.meta.url).href,
        back2:new URL('@/../public/images/back/2.jpg', import.meta.url).href,
        back3:new URL('@/../public/images/back/3.gif', import.meta.url).href,
        back4:new URL('@/../public/images/back/4.png', import.meta.url).href,
    }
};
export let theme = ref(false); // false:dark, true:light
