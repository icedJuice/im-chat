import cloneDeep from 'lodash/cloneDeep';

function imSession({ ws }) {
  this._messageListenList = [];

  this._session_ = null;
  this.heart = null;
  this._msgList = [];

  this.addMessageListener = function(fn) {
    if (this._messageListenList.indexOf(fn) === -1) {
      this._messageListenList.push(fn);
    }
  };
  this.removeMessageListener = function(fn) {
    this._messageListenList = this._messageListenList.filter(e => e !== fn);
  };

  this.init = function() {
    clearInterval(this.heart);
    window.inited = true;
    if (window.__IM_SESSION__) {
      this._session_ = window.__IM_SESSION__;
      return this;
    }
    const _ws = new WebSocket(ws);
    _ws.onopen = e => {
      this.onOpen(e);
    };
    _ws.onmessage = e => {
      this.onMessage(e);
    };
    _ws.onclose = e => {
      this.onClose(e);
    };

    _ws.onerror = e => {
      this.onError(e);
    };
    this._session_ = _ws;
    if (!window._patchIm_) {
      window._patchIm_ = new CustomEvent('_patchIm_', { detail: {} });
    }
    window.__IM_SESSION__ = _ws;
    return this;
  };

  this.send = function(action, data) {
    if (this._session_) {
      const userId = getCookie('userId');

      const msg = {
        action,
        ...data,
        userId,
        mid: Date.now()
      };
      if (!msg.mid) {
        msg.mid = Date.now();
      }
      if (action === 'cSendMsg') {
        if (this._msgList.findIndex(e => e.mid == msg.msg) < 0) {
          const cache = cloneDeep(msg);
          this._msgList.push(cache);
        }
      }
      if (window.__IM_CLOSED__ || this._session_.readyState !== 1) {
        window.__IM_SESSION__ = null;
        this.init();
        return;
      }
      try {
        this._session_.send(JSON.stringify(msg));
      } catch (e) {
        window.__IM_SESSION__ = null;
        this.init();
      }
    } else {
      this.onError();
    }
  };

  this.onOpen = function(evt) {
    window.__IM_CLOSED__ = false;
    const data = getBrowersInfo();
    this.send('cLogin', data);
  };

  this.onMessage = function(evt) {
    const res = JSON.parse(evt.data || '{}');
    if (res.action === 'cLogin') {
      const userId = res.data && res.data.userId;
      setCookie('userId', userId);
      if (this._msgList.length) {
        this._msgList.forEach(e => {
          this.send('cSendMsg', e);
        });
      }
    } else if (res.action == 'cSendMsg') {
      const index = this._msgList.findIndex(e => e.mid == res.data.mid);

      if (index >= 0) {
        this._msgList.splice(index, 1);
      }
    }
    if (this._messageListenList) {
      this._messageListenList.forEach(e => {
        e && e(res.action, res.data);
      });
    }
  };

  this.onClose = function(evt) {
    window.__IM_CLOSED__ = true;
  };

  this.onError = e => {
    window.__IM_SESSION__ = null;
    window.__IM_CLOSED__ = true;
  };
}

function getOS() {
  const sUserAgent = navigator.userAgent;

  const isWap = navigator.userAgent.match(/(android|iphone|ipad|ipod)/i);

  if (isWap) {
    return isWap[0];
  }

  const isWin = navigator.platform == 'Win32' || navigator.platform == 'Windows';
  const isMac =
    navigator.platform == 'Mac68K' ||
    navigator.platform == 'MacPPC' ||
    navigator.platform == 'Macintosh' ||
    navigator.platform == 'MacIntel';
  const isPhone = navigator.userAgent.match(/(iphone|android)/gi);
  if (isPhone) {
    return isPhone[0];
  }
  if (isMac) return 'Mac';
  const isUnix = navigator.platform == 'X11' && !isWin && !isMac;
  if (isUnix) return 'Unix';
  const isLinux = String(navigator.platform).indexOf('Linux') > -1;
  if (isLinux) return 'Linux';
  if (isWin) {
    const isWin7 = sUserAgent.indexOf('Windows NT 6.1') > -1 || sUserAgent.indexOf('Windows 7') > -1;
    if (isWin7) return 'Win7';
    const isWin10 = sUserAgent.indexOf('Windows NT 10') > -1 || sUserAgent.indexOf('Windows 10') > -1;
    if (isWin10) return 'Win10';
  }
  return 'other';
}

/**获得浏览器***/
function Browse() {
  const browser = {};
  const userAgent = navigator.userAgent.toLowerCase();
  let s;
  (s = userAgent.match(/msie ([\d.]+)/))
    ? (browser.ie = s[1])
    : (s = userAgent.match(/firefox\/([\d.]+)/))
      ? (browser.firefox = s[1])
      : (s = userAgent.match(/chrome\/([\d.]+)/))
        ? (browser.chrome = s[1])
        : (s = userAgent.match(/opera.([\d.]+)/))
          ? (browser.opera = s[1])
          : (s = userAgent.match(/version\/([\d.]+).*safari/))
            ? (browser.safari = s[1])
            : 0;
  let version = '';
  if (browser.ie) {
    version = 'IE ' + browser.ie;
  } else {
    if (browser.firefox) {
      version = 'firefox ' + browser.firefox;
    } else {
      if (browser.chrome) {
        version = 'chrome ' + browser.chrome;
      } else {
        if (browser.opera) {
          version = 'opera ' + browser.opera;
        } else {
          if (browser.safari) {
            version = 'safari ' + browser.safari;
          } else {
            version = '未知浏览器';
          }
        }
      }
    }
  }
  return version;
}

function getBrowersInfo() {
  const referrer = document.referrer;
  const channelReg = /(baidu|sougo|so|google|bing)\.(com|cn)/gi;
  const channelMatch = referrer && referrer.match(channelReg);
  const fromChannel = (channelMatch && channelMatch[0]) || '';
  const fromKeyRes = fromChannel ? referrer.match(/(q|wd|query)=(.[^&]*)/) : '';
  const isH5 = /iphone|ipad|ipod|android/i.test(navigator.userAgent);
  return {
    platform: isH5 ? 'H5' : 'WEB',
    advName: '',
    currentUrl: window.location.href,
    fromUrl: referrer,
    fromChannel,
    fromKey: fromKeyRes && fromKeyRes[2],
    screenSize: `${window.screen.width}-${window.screen.height}`,
    screenColor: window.screen.colorDepth,
    language: navigator.language || navigator.userLanguage,
    timeZone: new Date().getTimezoneOffset(),
    os: getOS(),
    browser: Browse(),
    agent: navigator.userAgent
  };
}

export function setCookie(key, value) {
  document.cookie = `${key}=${value}`;
}

export function getCookie(key) {
  const cookie = document.cookie;
  const reg = new RegExp(`${key}=(.[^;]+)`);
  const res = cookie.match(reg);
  return (res && res[1]) || '';
}

export default imSession;
