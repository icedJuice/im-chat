import { h, useState } from "preact";
import MobileUI from "./mobile-ui";
import PCUI from "./pc-ui";
import { isMobile } from "../utils/index";

import GlobalPop from "./components/global-pop";

import { disableBodyScroll, enableBodyScroll } from "./methods";

const isMobilePhone = isMobile();

let scrollHeart = null;

export default function({ config }) {
  // 弹框模式 0: 按钮， 1：小窗， 2： 全屏
  const [modeStatus, setModeStatus] = useState(0);
  // 侧边栏按钮闪动
  const [shink, setShink] = useState(false);
  // 用户ID
  const [userId, setUserId] = useState("");
  // 全屏广告图片地址
  const [pushImg, setPushImg] = useState("");
  // 弹出全屏广告
  const [showGlobalPop, setShowGlobalPop] = useState(false);

  // 是否已经强制弹出过对话框
  const [poped, setPoped] = useState(false);
  // 消息队列
  const [msgList, setMsgList] = useState(false);

  const onMessage = (action, data) => {
    switch (action) {
      case "cLogin":
        setUserId((data && data.userId) || "");
        break;
      case "cPushMsg":
        pushMessage(data, true);
        break;
    }
  };

  const popPushImg = (pushImg) => {
    setPushImg(pushImg);
    setShowGlobalPop(true);
    disableBodyScroll();
  };

  const pushMessage = (resList, isServer) => {
    const msgList = [];
    resList.forEach((msg) => {
      if (msg.mType == 1 || msg.mType == 2 || msg.mType == 51) {
        // 正常消息文本
        if (msg.msgContent) {
          msgList.push(msg);
        }
      } else if (msg.mType == 101) {
        // 强制弹出图片点击可以开始对话
        popPushImg(msg.msgContent);
      } else if (msg.mType == 102) {
        // 直接对话， 弹出小窗口
        setModeStatus(1);
      } else if (msg.mType == 103) {
        // 强制弹出全屏web对话

        popGlobalChat();
      }
    });

    if (msgList.length) {
      // 首次客服发消息时弹出对话框， 如果不是首次， 则闪动IM标
      if (modeStatus == 0) {
        if (!poped) {
          setPoped(true);
          setModeStatus(1);
        } else {
          setShink(true);
        }
      }
      // 消息存入state
      saveMessage(msgList, isServer);

      // 对话框滚动到底部
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    clearInterval(scrollHeart);
    scrollHeart = setTimeout(() => {
      const scrollEl = document.getElementById("dialogue_contain");
      scrollEl.scrollTop = scrollEl.scrollHeight - scrollEl.offsetHeight;
      const scrollEl2 = document.getElementById("im-container");
      if (scrollEl2) {
        scrollEl2.scrollTop = scrollEl2.scrollHeight - scrollEl2.offsetHeight;
      }
    }, 100);
  };

  const onGlobalPopClick = () => {
    if (modeStatus === 0) {
      setModeStatus(1);
    }
  };

  const onGlobalPopClose = () => {
    enableBodyScroll();
  };

  return (
    <div className="__im_chat_container">
      {isMobilePhone ? (
        <MobileUI
          userId={userId}
          shink={shink}
          modeStatus={modeStatus}
          msgList={msgList}
        />
      ) : (
        <PCUI
          userId={userId}
          shink={shink}
          modeStatus={modeStatus}
          msgList={msgList}
        />
      )}
      {showGlobalPop && (
        <GlobalPop
          onClick={onGlobalPopClick}
          onClose={onGlobalPopClose}
          popImg={pushImg || config.popImg}
        />
      )}
    </div>
  );
}
