const RootsDealRoomFactory = artifacts.require("./RootsDealRoomFactory.sol");

const configs = require('./../configs/config');

module.exports = function(deployer) {
  deployer.deploy(
      RootsDealRoomFactory,
      configs.tokenAddress
  );
};
