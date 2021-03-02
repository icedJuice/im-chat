import { h, useState } from "preact";
import { checkString  } from '../../../utils';

export default function DialogueSubmit({
    onSend,
}) {
  const [value, setValue] = useState("");
  const [isMsgShow, setIsMsgShow] = useState(false);

  const checkSubmit = () => {
      const fanelVale = checkString(value);
      if (fanelVale) {
        onSend(fanelVale);
      } else {
        setIsMsgShow(true);
      }
  }

  const onIptKeyEvt = (event) => {
    event.preventDefault();
    if (event.keyCode === 13) {
      if (!event.shiftKey) {
        checkSubmit(event.target.value);
        event.preventDefault();
      }
    }
  };

  const onChange = (event) => {
      if (isMsgShow) {
        setIsMsgShow(false);
      }
    setValue(event.target.value);
  };

  return (
    <div className="dialogue-submit">
      <p
        id="dialogue_hint"
        className={`dialogue-hint ${isMsgShow ? "show" : ""}`}
      >
        <span className="dialogue-hint-icon">!</span>
        <span className="dialogue-hint-text">发送内容不能为空</span>
      </p>
      <textarea
        className="dialogue-input-text"
        onChange={onChange}
        onKeyUp={onIptKeyEvt}
        value={value}
        placeholder="请输入您的问题..."
      ></textarea>
      <div className="dialogue-input-tools">
        <div>{/*  <!-- 小工具 -->  */}</div>
        <div>
          <span className="btn-send" onclick={onSendClick}>
            发送
          </span>
        </div>
      </div>
    </div>
  );
}
