'use strict';

class ServiceTwo {
  constructor(serviceOne) {
    this.serviceOne = serviceOne;
  }
}

module.exports = ServiceTwo;
module.exports.tags = ['serviceTwo', 'aliasedServiceTwo'];
