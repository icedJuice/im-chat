import cloneDeep from "lodash/cloneDeep";

class DefineClass {
  constructor() {
    this.state = {};

    this.setState = this.setState.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
  }

  setState(props) {
    const prevState = cloneDeep(this.state);
    const nextState = { ...this.state, ...props };
    this.onUpdate(nextState, prevState, cloneDeep(props));
    this.state = nextState;
  }

  onUpdate(nextState, prevState, changed) {
    if (this.onStateUpdate && typeof this.onStateUpdate === "function") {
      this.onStateUpdate(next, prev, changed);
    }
  }
}


export default DefineClass;