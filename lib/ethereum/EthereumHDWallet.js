import orderBy from 'lodash/orderBy';
import BigNumber from 'bignumber.js';
import EthereumTx from 'ethereumjs-tx';
import Web3 from 'web3';
import ProviderEngine from 'web3-provider-engine';
import WalletSubprovider from 'web3-provider-engine/subproviders/wallet';
// import Web3Subprovider from 'web3-provider-engine/subproviders/web3';
import findIndex from 'lodash/findIndex';
import isUndefined from 'lodash/isUndefined';
import { defaultTokens, erc20Abi, ETHEREUM_NETWORK, UNLIMITED_ALLOWANCE_IN_BASE_UNITS } from '../constants';
import Token from '../Token';
import HDWallet from '../HDWallet';
import Compound from './defi/Compound';
import Uniswap from './defi/Uniswap';
import Maker from './defi/Maker';
import Livepeer from './defi/Livepeer';
import Dydx from './defi/Dydx';
import Ethlend from './defi/Ethlend';

// const HookedWalletSubprovider = require('web3-provider-engine/subproviders/hooked-wallet.js')
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc.js')



/**
 * TODO:
 * [x] Complete HD implementation tests
 * [ ] All the fetch*() should return BigNumber
 * [ ] Check for all the inputs in function
 * 
 * NOTE: Since JS doesn't support multiple inheritance, this implamentation (for now) is duplicated in EthereumWallet
 */

export default class EthereumHDWallet extends HDWallet{
    /**
     * Accepts Valid bip32 passphrase
     * @param  {} secret=''
     */
    constructor(secret = null, address=null) {
        super(secret);
        
        this.type = 'EthereumHDWallet';
        this.name = 'ETH Wallet';
        this.networkName = ETHEREUM_NETWORK;
        // this.networkUrl = 'https://ethereum.api.nodesmith.io/v1/mainnet/jsonrpc?apiKey=34075bbcad494f7fae3b019a236643fd'; 
        this.networkUrl = 'https://mainnet.infura.io/v3/36bd6b2eb5c4446eaacf626dd90f529a';
        this.networkUrl = 'https://physically-super-cicada.quiknode.pro/yC30MO9gMROX0kl_GHkpnYBoDC9ZOGVxK4Zd8d9/';
        this.API_URL = 'https://api.etherscan.io/';
        this.BLOCKSCOUT = 'https://blockscout.com/eth/mainnet';
        this.CHAIN_ID = 1;
        this.symbol = 'ETH';
        this.ticker = 'ethereum';
        this.avgBlogTime = 5000;
        this.nonce = 0;
        this.coinPrice = 0;
        this.address = address;
        this.defaulTokenGasLimitLabel = 22000;
        this.watchOnly = secret === null ? true : false;
        this.defaultHDpath = "m/44'/60'/0'/0/0";
        this.decimal = 18;
        this.totalBalance = 0;
        this.netWorth = null;
        this.balance = 0;
        this.tokens = [];
        this.collectibles = [];
        this.secret = secret;
        this.transactions = [];
        this.usedAddresses = [];
        this.plugins = [{name:'Ethlend', class: Ethlend}, { name: 'Compound', class: Compound}, {name: 'Uniswap', class: Uniswap}, {name: 'Maker', class: Maker}, {name: 'Livepeer', class: Livepeer}, {name: 'Dydx', class: Dydx}]
    
        /**
         * Should we have a pending array?
         */
      
        if( secret ) {
            this.import();
            this.setWeb3();
        } else {
            const engine = new ProviderEngine();
            engine.addProvider(
                new RpcSubprovider({
                    rpcUrl: this.networkUrl
                }),
            );
            engine.start();
            this.web3 = new Web3(engine);
            this.web3.eth.defaultAccount = this.getAddress();

            if(this.plugins.length) {
                this.plugins.forEach( p => {
                    this[p.name] = new p.class(this)
                })
            }
        }
    }

    weiToEth( weiBalance ) {
        return this.web3.utils.fromWei(this.web3.utils.toBN( new BigNumber(weiBalance) ).toString() );
    }

    toWei( n ) {
        const w = new Web3();
        return w.utils.toWei( w.utils.toBN( new BigNumber(n.toString()) ).toString() );
    }

    bn( num ) {
        console.log('bn num', num.toString() );
        const big = new BigNumber(num.toString());
        console.log('bn num', big );
        console.log('web3.utils.isBigNumber', this.web3.utils.isBigNumber(big))
        console.log('hex', this.web3.utils.numberToHex(big))
        
        return this.web3.utils.toBN( big );
    }

    getAddress(){
        // return '0x8e5d30f161Ba3EbB09dc3c1F06515656af34BaA1'; // kyoronut
        // return '0xf6B6F07862A02C85628B3A9688beae07fEA9C863'; //Patricio
        // return '0xabf26352aadaaa1cabffb3a55e378bac6bf15791'; // gabriele
        if( this.watchOnly ) return this.address;
        return this.instanceWallet.getAddressString();
    }
    
    /**
     * This method should return a promise
     */
    async sync() {
        await this.loadTokensList(true);
        await this.fetchBalance();
    }

    setWeb3() {
        const engine = new ProviderEngine();
        Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send
        
        if(!this.watchOnly){
            // engine.addProvider(new HookedWalletSubprovider({
            //     getAccounts: function(cb){ cb([this.getAddress()]) },
            //     approveTransaction: function(cb){ console.log('approveTransaction') },
            //     signTransaction: function(cb){ console.log('signTransaction') },
            // }));
            engine.addProvider(new WalletSubprovider(this.instanceWallet, {}));
        }

        engine.addProvider(
            new RpcSubprovider({
                rpcUrl: this.networkUrl
            }),
        );

        engine.start();
        this.web3 = new Web3(engine);
        this.web3.eth.defaultAccount = this.getAddress();

        if(this.plugins.length) {
            this.plugins.forEach( p => {
                this[p.name] = new p.class(this)
            })
        }
    }

    async getNonce() {
        return new Promise((resolve, reject) => {
            try {
                this.web3.eth.getTransactionCount(this.getAddress(), "latest", (error, nonce) => {
                if (error) {
                    reject(error);
                }
                console.log('nonce', nonce)
                this.nonce = nonce;
                resolve(this.nonce);
            });
            } catch (e) {
                reject(e);
            }
        });
    }

    async waitForTx(txHash) {
        return new Promise((resolve, reject) => {
                let checked = 0;
                const handle = setInterval(() => {
                    this.web3.eth.getTransactionReceipt(txHash).then((resp) => {
                        if(resp != null && resp.blockNumber > 0) {
                            clearInterval(handle);
                            console.log('resp', resp)
                            resolve(resp);
                        } else {
                            checked++;
                            console.log('Not mined', checked)

                            if(checked > 100) {
                                clearInterval(handle);
                                reject('Not mined')
                            }
                        }
                    }) 
                }, 5000);
            }
        );
    }

    async checkTokenAllowanceForAddress(benificiay, tokenAddress=null) {
        if( isUndefined(benificiay) || tokenAddress === '' ) throw new Error(`tokenAddress: is undefined`);

        return new Promise( async (resolve, reject) => {
                const token = new this.web3.eth.Contract(erc20Abi, tokenAddress);
                console.log('token', token)
                const allowance = await token.methods.allowance(this.getAddress(), benificiay).call()
                console.log('allowance', allowance)
                resolve(allowance);
            }
        );
    }

    async sendSignedTransaction(signedTx) {
        return new Promise((resolve, reject) => {
            try {
                this.web3.eth.sendSignedTransaction('0x' + signedTx.toString('hex'), (error, tx) => {
                if (error) {
                    console.log('err', error);
                    alert(error.message);
                    reject(error);
                }
                console.log('tx', tx)
                resolve(tx);
            });
            } catch (e) {
                reject(e);
            }
        });
    }

    async getGasPrice() {
        return new Promise((resolve, reject) => {
            try {
            this.web3.eth.getGasPrice((error, price) => {
                if (error) {
                    reject(error);
                }
                this.gasPrice = this.web3.utils.fromWei(price.toString(), 'ether');
                resolve(price);
            });
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * return BigNumber
     */
    async fetchBalance() {
        return new Promise((resolve, reject) => {
            this.web3.eth.getBalance(this.getAddress()).then( weiBalance => {
            const balance = this.web3.utils.fromWei(weiBalance, 'ether');
            this.balance = parseFloat(balance);
            resolve(balance);
            }).catch(error => {
                console.log('error', error)
                reject(error)
            })
        });
    }

    async approveToken(contractAddress, amount = UNLIMITED_ALLOWANCE_IN_BASE_UNITS, benificiary, gasRec = 5) {
        const tokenInstance = new this.web3.eth.Contract(erc20Abi, contractAddress);
        const hex = this.web3.utils.toHex;

        return new Promise( async (resolve) => {
            const approveTransactionData = await tokenInstance.methods.approve(benificiary, amount).encodeABI();
            const approveTransactionGas = await tokenInstance.methods.approve(benificiary, amount).estimateGas();
            const nonce = await this.getNonce();

            const tx = {
                from: this.getAddress(),
                nonce: hex(nonce),
                to: contractAddress,
                gas: hex(approveTransactionGas),
                gasPrice: hex( this.web3.utils.toWei(gasRec.toString(), 'gwei') ),
                data: approveTransactionData, 
              }
              
              const signedApprove = this.signRawTx(tx);
              const txHash = await this.sendSignedTransaction(signedApprove);
              resolve(txHash);
        });
    }

    /**
     * return Number
     */
    async fetchERC20Balance(contractAddress, decimals = 18) {
        if( isUndefined(contractAddress) || contractAddress === '' ) throw new Error(`contractAddress: is undefined`);

        const idx = this.findTokenIdx(contractAddress);
        const tokenDecimals = decimals || this.tokens[idx].decimals;
        return new Promise((resolve, reject) => {
            try {
                const tokenInstance = new this.web3.eth.Contract(erc20Abi, contractAddress)

                tokenInstance.methods.balanceOf(this.getAddress()).call((error, decimalsBalance) => {
                    if (error) {
                        console.error(error);
                        resolve(0)
                    }

                    const balance = decimalsBalance / Math.pow(10, tokenDecimals);
                    this.tokens[idx].balance = balance;
                    this.tokens[idx].balanceDecimals = decimalsBalance;
                    this.tokens[idx].calcUsdValue();

                    resolve(balance);
                });
            } catch(e) {
                console.log('contractAddress',contractAddress)
                resolve(0)
            }
        });
    }

    getERC20Balance(contractAddress) {
        if( isUndefined(contractAddress) || contractAddress === '' ) throw new Error(`contractAddress: is undefined`);

        const idx = this.findTokenIdx(contractAddress);
        return this.tokens[idx].balance;
    }

    getERC20BalanceWei(contractAddress) {
        if( isUndefined(contractAddress) || contractAddress === '' ) throw new Error(`contractAddress: is undefined`);

        const idx = this.findTokenIdx(contractAddress);
        return this.tokens[idx].balanceDecimals;
    }

    findToken(contractAddress) {
        const idx = this.findTokenIdx(contractAddress);
        return this.tokens[idx];
    }

    findTokenIdx(contractAddress) {
        if( isUndefined(contractAddress) || contractAddress === '' ) throw new Error(`contractAddress: is undefined`);
        let idx = findIndex(this.tokens, function(o) { 
            if(!o.isNative){
                return o.contractAddress.toString().toLowerCase().trim() == contractAddress.toString().toLowerCase().trim(); 
            }
        });
        
        if( idx < 0) {
            // Token does not exist
            this.tokens.push(
                new Token(contractAddress.toString().toLowerCase().trim())
            )
            idx = findIndex(this.tokens, function(o) { 
                if(!o.isNative){
                    return o.contractAddress.toString().toLowerCase().trim() == contractAddress.toString().toLowerCase().trim(); 
                }
            });
        }
        return idx;
    }

    async export() {
        await this.loadTokensList(true);
        // await this.fetchTransactions();
        // await this.fetchCollectibles();
        await this.fetchBalance();
        await this.getAccountNetWorth();

        const wallet = {
            address: this.getAddress(),
            balance: this.balance,
            CDPS: this.Maker.CDPs,
            ether: await this.getCoin(),
            // collectibles: this.collectibles,
            // transaction: this.transactions,
            tokens: this.tokens,
            netWorthUSD: this.netWorth,
            ethlend: this.Ethlend.portfolio,
            uniswap: this.Uniswap.portfolio,
            compound: this.Compound.portfolio,
            dydx: this.Dydx.portfolio
        };

        return wallet;
    }

    async fetchTransactions() {
        await this.fetchEthTransactions();
        return this.transactions;
    }

    async fetchCollectibles() {
        const networkUrl = `https://api.opensea.io/api/v1/assets?owner=${this.getAddress()}&order_by=current_price&order_direction=asc`;
        return fetch(networkUrl)
          .then(response => response.json())
          .then(response => {
            this.collectibles = response.assets;
            return this.collectibles;
          }).catch(e => console.log(e));
    }

    async fetchEthTransactions() {
        const networkUrl = `${this.API_URL}api?module=account&action=txlist&address=${this.getAddress()}&startblock=0&endblock=99999999&sort=desc&apikey=YourApiKeyToken`;
        return fetch(networkUrl)
          .then(response => response.json())
          .then(res => res.result)
          .then(transactions => {
            this._lastPolling = (new Date()).getTime();
            this.transactions = transactions.filter( o => o.value !== '0').map(t => ({
              from: t.from,
              timestamp: t.timeStamp,
              transactionHash: t.hash,
              type: t.type,
              value: parseFloat(this.web3.utils.fromWei(t.value, 'ether')).toFixed(5),
            }));
            return this.transactions;
          }).catch(e => console.log(e));
    }

    async fetchTxInfo(txhash) {
        networkUrl = `${this.BLOCKSCOUT}/api?module=transaction&action=gettxinfo&txhash=${txhash}`;
        return fetch(networkUrl)
          .then(response => response.json())
          .then(res => res.result)
          .then(transaction => {
            return transaction;
          }).catch(e => console.log(e));
    }

    getERC20Transactions(contractAddress) {
        if( isUndefined(contractAddress) || contractAddress === '' ) throw new Error(`contractAddress: is undefined`);

        const idx = this.findTokenIdx(contractAddress);
        return this.tokens[idx].transactions;
    }

    async fetchERC20Transactions(contractAddress) {
        if( isUndefined(contractAddress) || contractAddress === '' ) throw new Error(`contractAddress: is undefined`);
        const url = `https://blockscout.com/eth/mainnet/api?module=account&action=tokentx&address=${this.getAddress()}&contractaddress=${contractAddress}&sort=desc`;
        return fetch(url)
          .then(response => response.json())
          .then(data => {
            const idx = findIndex(this.tokens, ['contractAddress', contractAddress]);
            this.tokens[idx]._lastPolling = (new Date()).getTime(); 
            this.tokens[idx].transactions = (data.result || []).map(t => {
              return {
                from: t.from,
                timestamp: t.timeStamp,
                transactionHash: t.hash,
                symbol: t.tokenSymbol,
                type: 'transfer',
                value: (
                  parseInt(t.value, 10) / Math.pow(10, t.tokenDecimal)
                ).toFixed(2),
              };
            });
        });
    }

    getTokenPrice = (fiat = 'USD', token = this.ticker) =>
        fetch(`https://api.coinmarketcap.com/v1/ticker/${token}/?convert=${fiat}`)
        .then(response => response.json())
        .then(data => {
            const lastUSD = parseFloat(data[0].price_usd) || 0;
            
            if(token === this.ticker) {
                this.coinPrice = lastUSD;
            }

            return lastUSD;
        })
        .catch(() => 0);
    
    async getAccountNetWorth() {
        let networth;
        const ethPrice = await this.getTokenPrice();
        networth = (parseFloat(ethPrice) * parseFloat(this.balance));

        this.tokens.forEach( t => {
            if( t.price && t.price.rate ) {
                networth += (parseFloat(t.price.rate) * parseFloat(t.balance));
            }
        });

        
        await this.Compound.getState();

        this.Compound.portfolio.forEach( t => {
            if( t.price && t.price.rate && t.supplyAmount) {
                networth += (parseFloat(t.price.rate) * parseFloat(t.supplyAmount.text));
            }
        })

        await this.Uniswap.getState();

        this.Uniswap.portfolio.forEach( t => {
            networth += parseFloat(t.value);
        })

        await this.Maker.getState();
        this.Maker.CDPs.forEach( c => {
            const price_collateral = (parseFloat(ethPrice) * parseFloat(c.eth));
            networth += price_collateral - parseFloat(c.art);
        })

        await this.Dydx.getState();
        this.Dydx.portfolio.forEach( t => {
            if( t.price && t.price.rate) {
                networth += (parseFloat(t.price.rate) * parseFloat(t.balance));
            }
        })

        await this.Ethlend.getState();
        networth += this.Ethlend.portfolio.totalBalanceUSD;


        this.netWorth = networth.toFixed(2);
        return networth.toFixed(2);
    }

    async getCoin() {
        return fetch(`https://api.coinmarketcap.com/v1/ticker/ethereum/`)
            .then(response => response.json())
            .then( async data => {
                data = data[0];
                const coin = {
                    contractAddress: null,
                    decimals: 18,
                    name: 'Ethereum',
                    symbol: 'ETH',
                    image: `https://raw.githubusercontent.com/Alexintosh/tokens/master/images/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png`,
                    
                    price: {
                        rate: data.price_usd,
                        rate_btc: data.price_btc,
                        diff: data.percent_change_24h,
                        marketCapUsd: data.market_cap_usd,
                        availableSupply: data.total_supply,
                        currency: "USD"
                    },
                    balance: this.balance,
                    balanceDecimals: this.web3.utils.toWei(this.balance.toString(), 'ether'),
                    usdValue: (parseFloat(data.price_usd) * parseFloat(this.balance))
                };

                return coin;
            });
    }


    async getTokenInfo(token) {
        const spamCoinList = [
            '0x0027449bf0887ca3e431d263ffdefb244d95b555',
            '0x2ff2b86c156583b1135c584fd940a1996fa4230b',
            '0xcce629ba507d7256cce7d30628279a155c5309c5',
            '0x0027449bf0887ca3e431d263ffdefb244d95b555',
        ]

        if( spamCoinList.includes(token.contractAddress) ) {
            return { price: {} }
        }

        return fetch(`https://api.ethplorer.io/getTokenInfo/${token.contractAddress}?apiKey=scwf7425sUxrtI106`)
            .then(response => response.json())
            .then( async data => {
                return data.price;
            });
    }

    // TODO tests
    async loadTokensList(pruneCache=false) {
        if( this.tokens.length > 0 && pruneCache === false ) return this.tokens;

        const spamCoinList = [
            '0x0027449bf0887ca3e431d263ffdefb244d95b555',
            '0x2ff2b86c156583b1135c584fd940a1996fa4230b',
            '0xcce629ba507d7256cce7d30628279a155c5309c5',
            '0x0027449bf0887ca3e431d263ffdefb244d95b555',
        ]

        //const url = `https://blockscout.com/eth/mainnet/api?module=account&action=tokenlist&address=${this.getAddress()}`;
        return fetch(`https://api.ethplorer.io/getAddressInfo/${this.getAddress()}?apiKey=scwf7425sUxrtI106`)
            .then(response => response.json())
            .then( async data => {
                if (!data.tokens) {
                    return;
                }

                const tokens = [];
                data.tokens.map(token => {
                    const tokenDecimal = parseInt(token.tokenInfo.decimals, 10);

                    const balance = parseFloat(new BigNumber(token.balance).div(new BigNumber(10).pow( tokenDecimal )).toString());

                    if( !spamCoinList.includes(token.tokenInfo.address) ) {
                        tokens.push(new Token(
                            token.tokenInfo.address,
                            tokenDecimal,
                            token.tokenInfo.name,
                            token.tokenInfo.symbol,
                            `https://raw.githubusercontent.com/Alexintosh/tokens/master/images/${token.tokenInfo.address}.png`,
                            token.tokenInfo.price,
                            balance,
                            new BigNumber(token.balance)
                        ))
                    }
                });

                const coin = defaultTokens[0];
                coin.balance = this.balance;
                this.tokens = orderBy(tokens, ['usdValue'], ['desc']);

                const promises = this.tokens.map(async t => this.fetchERC20Balance(t.contractAddress, parseInt(t.decimals) ));
                await Promise.all(promises)

                this.tokens = orderBy(this.tokens, ['usdValue'], ['desc']);

                return this.tokens;
            });
    }

    // TODO tests
    /**
     * Send an ETH transaction to the given address with the given amount
     *
     * @param {String} toAddress
     * @param {String} amount
     */
    sendTransaction(
        { contractAddress, decimals, isNative },
        toAddress,
        amount,
        gasLimit = 21000, 
        gasPrice = 21000000000
      ) {
        
        if ( isNative ) {
          return this.sendCoinTransaction(toAddress, amount, gasLimit, gasPrice);
        }
    
        return this.sendERC20Transaction(
          contractAddress,
          decimals,
          toAddress,
          amount,
          gasLimit,
          gasPrice
        );
      }
    

    // TODO tests
    /**
     * Send an ETH transaction to the given address with the given amount
     *
     * @param {String} toAddress
     * @param {String} amount
     */
    async sendCoinTransaction(toAddress, amount) {
        console.log('amount', amount)
        return new Promise((resolve, reject) => {
            this.web3.eth.sendTransaction(
                {
                    to: toAddress,
                    value: this.web3.utils.toWei( amount.toString(), 'ether'),
                }, 
                (error, transaction) => {
                    if (error) {
                        reject(error);
                    }

                    this._lastPolling = null;
                    this.transactions.push(transaction);
                    resolve(transaction);
                },
            );
        });
    }

    // TODO tests
    /**
     * Send an ETH erc20 transaction to the given address with the given amount
     *
     * @param {String} toAddress
     * @param {String} amount
     */
    async sendERC20Transaction(contractAddress, decimals, toAddress, amount, gasLimit, gasPrice) {
        const safeAmount = this.web3.utils.toBN( new BigNumber( (amount * Math.pow(10, decimals)).toString() ) );
        return new Promise((resolve, reject) => {
            const token = new this.web3.eth.Contract(erc20Abi, contractAddress);

            
            
            
            token
                .methods
                .transfer(toAddress, safeAmount)
                .send({from: this.getAddress(), gasLimit, gasPrice}, (error, transaction) => {
                        if (error) {
                            reject(error);
                        }

                        resolve(transaction);
                    }
                );
            }
        );
    }

    async estimateERC20Transaction({ contractAddress, isNative, decimals }, toAddress, amount) {
        // eslint-disable-next-line no-restricted-globals
        if(isNaN(amount)) return;

        // eslint-disable-next-line consistent-return
        return new Promise( async (resolve, reject) => {

            console.log('estimateERC20Transaction', [
                contractAddress,
                isNative,
                decimals,
                toAddress
            ])
            if ( isNative ) {
                resolve(21000);
                return;
            }

            const token = new this.web3.eth.Contract(erc20Abi, contractAddress);
            
            const gas = await token
                                .methods
                                .transfer(toAddress, this.web3.utils.toBN( new BigNumber( (amount * Math.pow(10, decimals)).toString() ) ) )
                                .estimateGas({
                                    from: this.getAddress()
                                })

            console.log('gas', gas);
            resolve(gas);
            }
        );
    }

    /**
     * Sign raw Transaction
     *
     * @param {String} toAddress
     * @param {String} amount
     */
    signRawTx(txData) {
        const tx = new EthereumTx(txData);
        const privateKeyHex = new Buffer(this.getPrivateKey(), 'hex');
        tx.sign( privateKeyHex );
        return tx.serialize();
    }
}