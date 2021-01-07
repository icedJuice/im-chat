/**
 *  悬浮按钮
*/
import { SUSPENSION_BUTTON_TEXT, SUSPENSION_BUTTON_ID } from '../constants';
import { div, span } from '@/core/elements';

const SuspensionButton = ({
    onClick = () => { },
    btnText = SUSPENSION_BUTTON_TEXT,
}) => {

    const el =  div({
        id: SUSPENSION_BUTTON_ID,
        className: 'imchat_sus-btn',
        events: [{ name: 'click', callback: onClick }];
        children: [
            div('消息')
        ],
    });
}