'use strict';

class Enode {
  constructor(properties){
    this.properties = properties;
    this.name = properties.name;
  };
  test() {
    return 5;
  }
}
module.exports = Enode;
