/**
 * showIMPop
 * 
 * @param { string | undefined } query 弹出弹窗需要发送的文本，可选
 * 
*/
export const showIMPop = (query) => {
    const event = new CustomEvent('_patchIm_', { detail: { query }});
    if(window.dispatchEvent) {  
        window.dispatchEvent(event);
    } else {
    window.fireEvent(event);
    }
}


export const disableBodyScroll = () => {
    document.body.classList.add('disable-scroll');
}

export const enableBodyScroll = () => {
    document.body.classList.remove('disable-scroll');
}