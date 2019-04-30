import Web3 from 'web3';
const ENS = require('ethjs-ens');

export default class ENSResolver {

    constructor() {
        this.networkUrl = 'https://mainnet.infura.io/v3/36bd6b2eb5c4446eaacf626dd90f529a';
        const provider = new Web3.providers.HttpProvider(this.networkUrl);
        this.CHAIN_ID = 1;
        this.instance = new ENS({ provider, network: this.CHAIN_ID.toString() });
    }

    byAddress(address) {
      return new Promise((resolve, reject) => {
        try {
          this.instance
            .reverse(address)
            .then(domain => {
              try {
                resolve(domain);
              } catch (e) {
                reject(e);
              }
            })
            .catch(reason => {
              try {
                reject(reason);
              } catch (e) {
                reject(reason);
              }
            });
        } catch (e) {
          reject(e);
        }
      });
    }

    byDomain(domain) {
      return new Promise((resolve, reject) => {
        try {
          this.instance
            .lookup(domain)
            .then(address => {
              try {
                resolve(address);
              } catch (e) {
                console.log(e);
                reject(e);
              }
            })
            .catch(reason => {
              try {
                console.log(reason);
                reject(reason);
              } catch (e) {
                reject(reason);
              }
            });
        } catch (e) {
          console.log(e);
          reject(e);
        }
      });
    }
}