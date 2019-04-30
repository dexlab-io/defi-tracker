import BigNumber from 'bignumber.js';

export const BITCOIN_NETWORK = 'BITCOIN';
export const UBIQ_NETWORK = 'UBIQ';
export const ELLAISM_NETWORK = 'ELLAISM';
export const POA_NETWORK = 'POA';
export const ETC_NETWORK = 'ETC';
export const XDAI_NETWORK = 'XDAI';
export const ETHEREUM_NETWORK = 'MAIN';
export const ETHEREUM_TESTNET_KOVAN = 'KOVAN';
export const ETHEREUM_TESTNET_ROPSTEN = 'ROPSTEN';

const defaultTokens = [
  {
    name: 'Ethereum',
    id: 1,
    image: `https://s2.coinmarketcap.com/static/img/coins/32x32/1027.png`,
    symbol: 'ETH',
    isSendAllow: true,
    isNative: true,
    tokensEnabled: true,
    decimals: 18,
  },
];

const erc20Abi = [{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"supply","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"digits","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}];

export const UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2).pow(256).minus(1); // new BigNumber(2).pow(100);

export {
  defaultTokens,
  erc20Abi
};
