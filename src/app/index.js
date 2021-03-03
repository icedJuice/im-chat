import { h, useState, Component } from "preact";
import MobileUI from "./mobile-ui";
import PCUI from "./pc-ui";
import { isMobile } from "../utils/index";
import imSession, { getCookie } from '../core';


import GlobalPop from "./components/global-pop";

import { disableBodyScroll, enableBodyScroll } from "./methods";

const isMobilePhone = isMobile();

let scrollHeart = null;

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modeStatus: 0, // 弹框模式 0: 按钮， 1：小窗， 2： 全屏
      shink: false, // 侧边栏按钮闪动
      userId: null, // 用户ID
      pushImg: null, // 全屏广告图片地址
      showGlobalPop: false, // 弹出全屏广告
      poped: false, // 是否已经强制弹出过对话
      msgList: [], // 消息列表
      serveInfo: {},
    }
    this.ws = null;
    this.initImSession = this.initImSession.bind(this);
    this.checkSubmit = this.checkSubmit.bind(this);
    this.pushMessage = this.pushMessage.bind(this);
    this.popPushImg = this.popPushImg.bind(this);
    this.sendWs = this.sendWs.bind(this);
    this.onPatch = this.onPatch.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);

    
    

  }

  componentDidMount() {
    this.initImSession();
  }
  
  initImSession () {
    if (!window.__IM_SESSION__) {
      this.ws = (new imSession({})).init();
    } else {
      this.ws = window.__IM_SESSION__;
    }
     if (this.ws && this.ws.addMessageListener) {
      this.ws.addMessageListener(this.onMessage);
    }

    this.setCurrentStat(window.location.pathname);
    const stat = {
      fromPageUrl: document.referrer,
      toPageUrl: window.location.pathname,
      stayTime: null,
    }
    setTimeout(( ) => {
      this.sendWs(stat);
      const userId = getCookie('userId');
      if (userId) {
        this.setState({userId});
      }
    }, 2200);

    window.addEventListener('_patchIm_', this.onPatch)
  };

  checkSubmit (value) {
    return new Promise((res) => {
      if (!this.ws) {
        this.$message('消息通道连接失败。');
        res({
          code: 101, // 消息通道连接失败
        });
        return;
      }
      const msg = {
        mType: 1,
      };
      if (value) {
        if (/^\s*$/g.test(value)) {
          res({
            code: 103, // 消息全不为字符
          });
          return;
        }
        msg.msgContent = value;
      } else {
        if (/^\s*$/g.test(value)) {
          res({
            code: 102, // 消息为空
          });
          return;
        }
        msg.msgContent = value;
      }
      this.pushMessage(
        [{
          isClient: true,
          ...msg
        }]
      );
      this.ws.send('cSendMsg', msg);
      res({
        code: 200, // 发送成功
      });
    });
  }

  pushMessage(resList, isServer) {
    const msgList = [];
    resList.forEach((msg) => {
      if (msg.mType == 1 || msg.mType == 2 || msg.mType == 51) {
        // 正常消息文本
        if (msg.msgContent) {
          msgList.push(msg);
        }
      } else if (msg.mType == 101) {
        // 强制弹出图片点击可以开始对话
        this.popPushImg(msg.msgContent);
      } else if (msg.mType == 102) {
        // 直接对话， 弹出小窗口
        this.modeStatus = 1;
        this.setState({
          modeStatus: 1,
        });
      } else if (msg.mType == 103) {
        // 强制弹出全屏web对话
        this.setState({
          modeStatus: 2,
        });
        disableBodyScroll();

      }
    });

    if (msgList.length) {
      // 首次客服发消息时弹出对话框， 如果不是首次， 则闪动IM标
      if (this.modeStatus == 0) {
        if (!this.poped) {
          this.poped = true;
          this.modeStatus = 1;
        } else {
          this.shink = true;
        }
      }
      
      // 消息存入store
      this.$store.dispatch('im/pushMessage', { msgList, isServer });
      
      // 对话框滚动到底部
      this.scrollToBottom();
    }
  }

  popPushImg(pushImg) {
    this.setState({
      pushImg,
      showGlobalPop: true,
    });
    disableBodyScroll();
  }

  sendWs(stat) {
    if (this.ws) {
      this.ws.send('cTrack', stat);
    }
  }

  onPatch(event) {
    this.setState({
      modeStatus: 1,
      shink: false,
    });
    const query = event.detail.query;
    if (query) {
      this.checkSubmit(query);
    }
    this.scrollToBottom();
  }

  scrollToBottom() {
    clearInterval(scrollHeart);
    scrollHeart = setTimeout(() => {
      const scrollEl = document.getElementById("dialogue_contain");
      scrollEl.scrollTop = scrollEl.scrollHeight - scrollEl.offsetHeight;
      const scrollEl2 = document.getElementById("im-container");
      if (scrollEl2) {
        scrollEl2.scrollTop = scrollEl2.scrollHeight - scrollEl2.offsetHeight;
      }
    }, 150);
  };

  render() {
    const { userId, shink, pushImg, modeStatus, showGlobalPop, msgList} = this.state;
    const { config } = this.props;
    return (
      <div className="__im_chat_container">
        {isMobilePhone ? (
          <MobileUI
            userId={userId}
            shink={shink}
            modeStatus={modeStatus}
            msgList={msgList}
            checkSubmit={this.checkSubmit}
            config={config}
  
          />
        ) : (
          <PCUI
            userId={userId}
            shink={shink}
            modeStatus={modeStatus}
            msgList={msgList}
            checkSubmit={this.checkSubmit}
            config={config}
          />
        )}
        {showGlobalPop && (
          <GlobalPop
            onClick={this.onGlobalPopClick}
            onClose={this.onGlobalPopClose}
            popImg={pushImg || config.popImg}
          />
        )}
      </div>
    );
  }

  
}

// export default function({ config }) {

//   // 弹框模式 0: 按钮， 1：小窗， 2： 全屏
//   const [modeStatus, setModeStatus] = useState(0);
//   // 侧边栏按钮闪动
//   const [shink, setShink] = useState(false);
//   // 用户ID
//   const [userId, setUserId] = useState("");
//   // 全屏广告图片地址
//   const [pushImg, setPushImg] = useState("");
//   // 弹出全屏广告
//   const [showGlobalPop, setShowGlobalPop] = useState(false);

//   // 是否已经强制弹出过对话框
//   const [poped, setPoped] = useState(false);
//   // 消息队列
//   const [msgList, setMsgList] = useState(false);

//   const onMessage = (action, data) => {
//     switch (action) {
//       case "cLogin":
//         setUserId((data && data.userId) || "");
//         break;
//       case "cPushMsg":
//         pushMessage(data, true);
//         break;
//     }
//   };

//   const popPushImg = (pushImg) => {
//     setPushImg(pushImg);
//     setShowGlobalPop(true);
//     disableBodyScroll();
//   };

//   const pushMessage = (resList, isServer) => {
//     const msgList = [];
//     resList.forEach((msg) => {
//       if (msg.mType == 1 || msg.mType == 2 || msg.mType == 51) {
//         // 正常消息文本
//         if (msg.msgContent) {
//           msgList.push(msg);
//         }
//       } else if (msg.mType == 101) {
//         // 强制弹出图片点击可以开始对话
//         popPushImg(msg.msgContent);
//       } else if (msg.mType == 102) {
//         // 直接对话， 弹出小窗口
//         setModeStatus(1);
//       } else if (msg.mType == 103) {
//         // 强制弹出全屏web对话

//         popGlobalChat();
//       }
//     });

//     if (msgList.length) {
//       // 首次客服发消息时弹出对话框， 如果不是首次， 则闪动IM标
//       if (modeStatus == 0) {
//         if (!poped) {
//           setPoped(true);
//           setModeStatus(1);
//         } else {
//           setShink(true);
//         }
//       }
//       // 消息存入state
//       saveMessage(msgList, isServer);

//       // 对话框滚动到底部
//       scrollToBottom();
//     }
//   };

//   const scrollToBottom = () => {
//     clearInterval(scrollHeart);
//     scrollHeart = setTimeout(() => {
//       const scrollEl = document.getElementById("dialogue_contain");
//       scrollEl.scrollTop = scrollEl.scrollHeight - scrollEl.offsetHeight;
//       const scrollEl2 = document.getElementById("im-container");
//       if (scrollEl2) {
//         scrollEl2.scrollTop = scrollEl2.scrollHeight - scrollEl2.offsetHeight;
//       }
//     }, 100);
//   };

//   const onGlobalPopClick = () => {
//     if (modeStatus === 0) {
//       setModeStatus(1);
//     }
//   };

//   const onGlobalPopClose = () => {
//     enableBodyScroll();
//   };

//   return (
//     <div className="__im_chat_container">
//       {isMobilePhone ? (
//         <MobileUI
//           userId={userId}
//           shink={shink}
//           modeStatus={modeStatus}
//           msgList={msgList}
//           heckSubmit={heckSubmit}
//           config={config}

//         />
//       ) : (
//         <PCUI
//           userId={userId}
//           shink={shink}
//           modeStatus={modeStatus}
//           msgList={msgList}
//           heckSubmit={heckSubmit}
//           config={config}
//         />
//       )}
//       {showGlobalPop && (
//         <GlobalPop
//           onClick={onGlobalPopClick}
//           onClose={onGlobalPopClose}
//           popImg={pushImg || config.popImg}
//         />
//       )}
//     </div>
//   );
// }
