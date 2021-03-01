import App from '../app';
import React from 'react';
import ReactDOM from 'react-dom';
import imSession from '../core';
import { rootElId, defaultConfig } from '../config';

function initApp (config) {
    
    const rootEl = document.createElement('div');
    rootEl.setAttribute('id', rootElId);
    document.body.appendChild(rootEl);
    
    ReactDOM.render( <App {...config} />, rootEl );
}

export default function __IMC__ (config) {
    const _config = Object.assign(defaultConfig, (config || {}));
    const { disableUI } = _config;

    const _imc = new imSession(config);

    if (!disableUI) {
        initApp(_config);
    }

    return _imc;
};
