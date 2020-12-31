import defaultConfig from "../config";

class IMC {
  constructor(props) {
    this._config = Object.assign(defaultConfig, (props || {}));

    this._eventQueue = [];
    this.addMsgListener = this.addMsgListener.bind(this);
    this.removeMsgListener = this.removeMsgListener.bind(this);
    this.init = this.init.bind(this);
    this.putChatUI = this.putChitUI.bind(this);

    // this.init();
  }

  addMsgListener(fn) {
    const binded = this._eventQueue.indexOf(fn) >= 0;
    if (!binded) {
      this._eventQueue.push(binded);
    }
  }
  removeMsgListener(fn) {
    const targetIndex = this._eventQueue.indexOf(fn);
    if (targetIndex >= 0) {
      this._eventQueue.splice(targetIndex, 1);
    }
  }
  
  init() {
    const { ui } = this._config;
  }

  putChatUI() {

  }
}

export default IMC;
