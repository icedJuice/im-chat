import { h } from 'preact';

import './style.less';

export default function GlobalPop({
    onClick,
    onClose,
    popImg,
}) {

    return <div class="comp-global-pop" v-show="isImgPopShow">
        <div class="pop-inner">
            <div class="pop-cont" onClick={onClick}>
                <img class="pop-img" src={popImg} alt="律师事务所" />
            </div>
            <i class="close-icon" onClick={onClose}></i>
        </div>
    </div>;
};
