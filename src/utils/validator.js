import methods from "validator";

class Validator {
  constructor(rules) {
    this.rules = rules;
    this.initiate();
  }

  initiate() {
    this.errors = {};
  }

  validate(state) {
    this.initiate();

    this.rules.forEach((rule) => {
      const fieldValue =
        (typeof state[rule.field] === "object"
          ? state[rule.field].value
          : state[rule.field]) || ""; // check duoc ca obj {label: "", value:""}
      const option = rule.option ? rule.option : {};
      const validationMethod =
        typeof rule.method === "string" ? methods[rule.method] : rule.method;

      if (validationMethod(fieldValue, option) !== rule.validWhen) {
        this.errors[rule.field] = rule.message;
      }
    });
    return this.errors;
  }
}

export default Validator;
