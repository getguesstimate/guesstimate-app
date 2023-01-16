// unused
export class InputToGuesstimate {
  input: any;

  constructor(input) {
    this.input = input;
  }
  toGuesstimate() {
    if (this.isFunction()) {
      return { funct: this.parseFunction() };
    } else if (this.isEstimate()) {
      return { estimate: this.parseEstimate() };
    } else {
      return {};
    }
  }
  toEditorState() {
    if (this.isFunction()) {
      return "function";
    } else if (this.isEstimate()) {
      return "estimate";
    } else {
      return "editing";
    }
  }
  isFunction() {
    return this.input[0] === "=";
  }
  parseFunction() {
    return { textField: this.input };
  }
  isEstimate() {
    return this.parseEstimate() !== false;
  }
  parseEstimate() {
    if (this.input.includes("/")) {
      let [median, stdev] = this.input.split("/").map((e) => e.trim());
      return { median, stdev };
    } else {
      return false;
    }
  }
}
