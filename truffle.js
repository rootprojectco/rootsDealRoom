const HDWalletProvider = require("truffle-hdwallet-provider-privkey");

const configs = require('./configs/config');

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!

    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*" // Match any network id
        },
        rinkeby: {
            provider: new HDWalletProvider([configs.privateKey], configs.providers.rinkeby.host),
            from: "0x519236ebefc7014a9815898855dd3ebbdd137b25",
            network_id: '*',
            gas: 4500000,
            gasPrice: 25000000000
        },
    }
};
