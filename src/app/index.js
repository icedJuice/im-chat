import { h, useReducer } from 'preact';
import MobileUI from './MobileUI';
import PCUI from './PCUI';
import { isMobile } from '../utils/index';

const isMobilePhone = isMobile();

export default function () {
    // const [state, setState] = useReducer((states, action) => {
    //     return {
    //         ...states,
    //         ...(action || {}),
    //     };
    // });

    return <div className="__im_chat_container">
        {
            isMobilePhone ? <MobileUI /> : < PCUI />
        }
    </div>;
}