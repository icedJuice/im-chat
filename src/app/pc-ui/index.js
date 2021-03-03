import { h, Component } from "preact";
import FloatBtn from "../components/float-btn";
import DialogueSubmit from "../components/dialogue-submit-pc";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
    this.onIptKeyEvt = this.onIptKeyEvt.bind(this);
    this.checkSubmit = this.checkSubmit.bind(this);
  }

  onIptKeyEvt(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      if (!event.shiftKey) {
        this.checkSubmit(event.target.value);
        event.preventDefault();
      }
    }
  }

  render() {
    const { modeStatus, config, checkSubmit } = this.props;

    const { serveInfo } = config || {};
    return (
      <div className={`dialogue-wrapper mode-status-${modeStatus}`}>
        <FloatBtn />

        <div className="dialogue-main">
          <div className="dialogue-header">
            <div className="dialogue-close">
              {modeStatus !== 2 && (
                <i onClick="globalChat" className="dialogue-btn btn-global" />
              )}
              <i onClick="closeChat" className="dialogue-btn btn-close" />
            </div>

            <div className="dialogue-service-info">
              <i className="dialogue-service-img"></i>
              <div className="dialogue-service-title">
                <p className="dialogue-service-name">
                  {serveInfo ? serveInfo.fromName : "客服1"}
                </p>
                <p className="dialogue-service-detail">中国房地产律师网</p>
              </div>
            </div>
          </div>

          <div
            id="dialogue_contain"
            className="dialogue-contain"
            ref="scrollEl"
          >
            {msgList.length
              ? msgList.map((msg, i) => {
                  const cls =
                    msg.isClient || msg.fromId == userId ? "reverse" : "";
                  return (
                    <p className={`dialogue-service-contain ${cls}`}>
                      {msg.mType === 2 ? (
                        <span className="dialogue-text dialogue-service-text">
                          <Image
                            className="dialogue-img"
                            src={msg.msgContent}
                          />
                        </span>
                      ) : (
                        <span
                          v-else
                          className="dialogue-text dialogue-service-text"
                        >
                          {msg.msgContent}
                        </span>
                      )}
                    </p>
                  );
                })
              : null}
          </div>

          <DialogueSubmit onSend={checkSubmit} />
        </div>
      </div>
    );
  }
}


// export default function({
//   checkSubmit,
//   msgList,
//   modeStatus,
//   serveInfo,
//   configs,
// }) {
//   const [value, setValue] = useState("");

//   const onIptKeyEvt = (event) => {
//     event.preventDefault();
//     if (event.keyCode === 13) {
//       if (!event.shiftKey) {
//         checkSubmit(event.target.value);
//         event.preventDefault();
//       }
//     }
//   };

//   return (
//     <div
//       className={`dialogue-wrapper mode-status-${modeStatus} ${
//         hideBottom ? "hide" : ""
//       }`}
//     >
//       <FloatBtn />

//       <div className="dialogue-main">
//         <div className="dialogue-header">
//           <div className="dialogue-close">
//             {modeStatus !== 2 && (
//               <i onClick="globalChat" className="dialogue-btn btn-global" />
//             )}
//             <i onClick="closeChat" className="dialogue-btn btn-close" />
//           </div>

//           <div className="dialogue-service-info">
//             <i className="dialogue-service-img"></i>
//             <div className="dialogue-service-title">
//               <p className="dialogue-service-name">
//                 {serveInfo ? serveInfo.fromName : "客服1"}
//               </p>
//               <p className="dialogue-service-detail">中国房地产律师网</p>
//             </div>
//           </div>
//         </div>

//         <div id="dialogue_contain" className="dialogue-contain" ref="scrollEl">
//           {msgList.length
//             ? msgList.map((msg, i) => {
//                 const cls =
//                   msg.isClient || msg.fromId == userId ? "reverse" : "";
//                 return (
//                   <p className={`dialogue-service-contain ${cls}`}>
//                     {msg.mType === 2 ? (
//                       <span className="dialogue-text dialogue-service-text">
//                         <Image className="dialogue-img" src={msg.msgContent} />
//                       </span>
//                     ) : (
//                       <span
//                         v-else
//                         className="dialogue-text dialogue-service-text"
//                       >
//                         {msg.msgContent}
//                       </span>
//                     )}
//                   </p>
//                 );
//               })
//             : null}
//         </div>

//         <DialogueSubmit onSend={heckSubmit} />
//       </div>
//     </div>
//   );
// }
