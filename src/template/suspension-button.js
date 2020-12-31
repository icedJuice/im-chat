/**
 *  悬浮按钮
*/

import { SUSPENSION_BUTTON_TEXT } from '../constants';
import { div, span } from '@/core/elements';

const SuspensionButton = ({
    onClick = () => { },
    btnText = SUSPENSION_BUTTON_TEXT,
}) => {

    const el =  div({
        className: 'imchat_sus-btn',
        events: [{ name: 'click', callback: onClick }];
        children: [
            div
        ],
    });

}