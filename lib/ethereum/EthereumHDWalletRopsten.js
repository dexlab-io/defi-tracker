import EthereumHDWallet from './EthereumHDWallet';
import BigNumber from 'bignumber.js';
import Token from '../Token';
import { defaultTokens } from '../../utils/constants';
import {
    ETHEREUM_TESTNET_ROPSTEN,
} from '../../utils/constants';

export default class EthereumHDWalletRopsten extends EthereumHDWallet{
    /**
     * Accepts Valid bip32 passphrase
     * @param  {} secret=''
     */
    constructor(secret = null, address=null) {
        super(secret, address);
        this.type = 'EthereumHDWalletRopsten';
        this.name = 'Ropsten wallet';
        this.networkName = ETHEREUM_TESTNET_ROPSTEN;
        this.networkUrl = 'https://ropsten.infura.io/Q1GYXZMXNXfKuURbwBWB';
        this.API_URL = 'https://api-ropsten.etherscan.io/';
        this.CHAIN_ID = 3;
        if( secret ) {
            this.setWeb3();
        }
    }

    async fetchERC20Transactions(contractAddress) {
        return null;
    }
    // TODO tests
    /**
     * Load the tokens based on network
     */
    async loadTokensList() {
        if( this.tokens.length > 0) return this.tokens;

        const url = `https://blockscout.com/eth/ropsten/api?module=account&action=tokenlist&address=${this.getAddress()}`;
        return fetch(url)
            .then(response => response.json())
            .then(data => {
                if (!data.result) {
                    return;
                }

                const tokens = data.result.map(token => {
                    const tokenDecimal = parseInt(token.decimals, 10);
                    const balance = parseFloat(new BigNumber(token.balance).div(new BigNumber(10).pow( tokenDecimal )).toString());
                    return new Token(
                        token.contractAddress,
                        tokenDecimal,
                        token.name,
                        token.symbol,
                        `https://raw.githubusercontent.com/Alexintosh/tokens/master/images/${token.contractAddress}.png`,
                        {},
                        balance,
                        new BigNumber(token.balance)
                    )
                });

                const coin = defaultTokens[0];
                coin.balance = this.balance;
                this.tokens = tokens;

                console.log('tokens', tokens)
                return this.tokens;
            });
    }
}