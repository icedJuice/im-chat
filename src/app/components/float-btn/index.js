import { h } from 'preact';

import { showIMPop } from '../../methods';

export default function  FloatBtn({ shink }) {

    const showPop = () => {
        showIMPop();
    }

    return <div id="btn_open" class={`dialogue-support-btn ${shink ? 'shink' : ''}`} onclick={showPop}>
    <i class="dialogue-support-icon"></i>
    <i class="dialogue-support-line"></i>
    <span class="dialogue-support-text">联系客服</span>
</div>;
}