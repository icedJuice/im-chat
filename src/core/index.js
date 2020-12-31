import defaultConfig from "./defaultConfig";
class IMC {
  constructor(props) {
    this._config = Object.assign(defaultConfig, (props || {}));

    this._eventQueue = [];
    this.addMsgListener = this.addMsgListener.bind(this);
    this.removeMsgListener = this.removeMsgListener.bind(this);
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
  
}

export default IMC;
