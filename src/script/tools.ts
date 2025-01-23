// 重写setItem事件，当使用setItem的时候，触发，window.dispatchEvent派发事件
function dispatchEventStroage() {
    const signSetItem = localStorage.setItem;
    localStorage.setItem = function(key, val) {
        let setEvent = new CustomEvent('setItemEvent', {
            detail: { key, newValue: val }
        });
        window.dispatchEvent(setEvent);
        
        // 使用类型断言，转换为正确的参数类型
        signSetItem.call(this, key as string, val as string);
    }
}

export default dispatchEventStroage;
