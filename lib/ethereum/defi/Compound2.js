/* eslint-disable class-methods-use-this */
import isUndefined from 'lodash/isUndefined';
import findIndex from 'lodash/findIndex';

class Compound2 {
    constructor(wallet) {
        this.W = wallet;

        this.cacheApi = null;
        this.portfolio = [
            { contractAddress: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359', cTokenAddress:"0xf5dce57282a584d2746faf1593d3121fcac444dc", name: 'DAI', symbol:'DAI'},
            { contractAddress: '0xe41d2489571d322189246dafa5ebde1f4699f498', cTokenAddress:"0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407", name: 'ZRX', symbol:'ZRX'},
            { contractAddress: '0x0d8775f648430679a709e98d2b0cb6250d2887ef', cTokenAddress:"0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e", name: 'BAT', symbol:'BAT'},
            { contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', cTokenAddress:"0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5", name: 'WETH', symbol:'WETH'},

            { contractAddress: '0x1985365e9f78359a9B6AD760e32412f4a445E862', cTokenAddress:"0x158079ee67fce2f58472a96584a73c7ab9ac95c1", name: 'REP', symbol:'REP'},
            { contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', cTokenAddress:"0x39aa39c021dfbae8fac545936693ac917d5e7563", name: 'USDC', symbol:'USDC'},
        ];
    }

    findToken(contractAddress) {
        if( isUndefined(contractAddress) || contractAddress === '' ) throw new Error(`contractAddress: is undefined`);
        const idx = findIndex(this.portfolio, (o) => { 
            return o.contractAddress.toString().toLowerCase().trim() === contractAddress.toString().toLowerCase().trim(); 
        });
        if( idx < 0) {
            return false;
        }
        return idx;
    }

    getYouEarned(principalBalance, balanceWithInterest) {
        return ((balanceWithInterest.wei - principalBalance) / 1e18).toFixed(2);
    }

    calculateApr(rateMantissa) {
        const expRate = rateMantissa * 1e18;
        const BLOCKS_PER_YEAR = 2102400;
        const APR = ((expRate * BLOCKS_PER_YEAR) / 1e18) * 100;
        return APR.toFixed(2);
    }

    async getApiValues() {
        return fetch(`https://api.alpha.compound.finance/api/v2/account?addresses[]=${this.W.getAddress()}`)
        .then(response => response.json())
        .then( async data => {

            console.log('data', data);
            this.cacheApi = data;

            if(data.accounts[0]  && data.accounts[0].tokens) {
                data.accounts[0].tokens.forEach( t => {
                    const idx = findIndex(this.portfolio, (o) => { 
                        return o.cTokenAddress.toString().toLowerCase().trim() === t.address.toString().toLowerCase().trim(); 
                    });

                    this.portfolio[idx].api = t;
                    this.portfolio[idx].earned = parseFloat(t.lifetime_supply_interest_accrued.value).toFixed(2).toString() || 0;
                });
            }
        })
    }
    
    async getTokenState(contractAddress) {
        const idx = this.findToken(contractAddress);

        this.portfolio[idx].supplyAmount = await this.getSupplyBalance(this.portfolio[idx].contractAddress);
        this.portfolio[idx].supplyRateMantissa = await this.getMarketInfo(this.portfolio[idx].contractAddress);

        this.portfolio[idx].apr = this.calculateApr(this.portfolio[idx].supplyRateMantissa);
        this.portfolio[idx].price = await this.W.getTokenInfo(this.portfolio[idx]);

        // console.log('this.portfolio[idx]', this.portfolio[idx])
        return this.portfolio[idx];
    }

    async getMarketInfo(tokenAddress) {
        const idx = this.findToken(tokenAddress);
        const cToken = new this.W.web3.eth.Contract(cERC20ABI, this.portfolio[idx].cTokenAddress);
        const supplyRate = (await cToken.methods.supplyRatePerBlock().call()) / 1e18;
        return supplyRate;
    }

    async getState() {
        await this.getApiValues();
        const promises = this.portfolio.map(async t => this.getTokenState(t.contractAddress));
        await Promise.all(promises)
    }

    async getSupplyBalance(tokenAddress) {
        const idx = this.findToken(tokenAddress);
        const cToken = new this.W.web3.eth.Contract(cERC20ABI, this.portfolio[idx].cTokenAddress);

        const weiBalance = await cToken.methods.balanceOf(this.W.getAddress()).call();
        const exchangeRate = (await cToken.methods.exchangeRateCurrent().call()) / 1e18;
        const balanceOfUnderlying = (await cToken.methods.balanceOfUnderlying(this.W.getAddress()).call()) / 1e18;

        const bn = parseFloat(balanceOfUnderlying).toFixed(2).toString();

        return {
            wei: weiBalance,
            text: bn.toString()
        }
    }

    async supply(srcAddress, amount, gasPrice="20") {
        const srcAmount = this.W.web3.utils.toWei(amount.toString());
        const hex = this.W.web3.utils.toHex;

        const supplyTxData = await this.instance.methods.supply(srcAddress, srcAmount).encodeABI();
        const supplyTxGas = await this.instance.methods.supply(srcAddress, srcAmount).estimateGas();

        const nonce = await this.W.getNonce();

        const txSupply = {
            from: this.W.getAddress(),
            nonce: hex(nonce),
            value: "0x0",
            to: this.markets.moneyMarket.address,
            gas: hex(supplyTxGas),
            gasPrice: hex( this.W.web3.utils.toWei(gasPrice, 'gwei') ),
            data: supplyTxData, 
        };

        const signedTx = this.W.signRawTx(txSupply);

        const supplyTxHash = await this.W.sendSignedTransaction(signedTx);
        return supplyTxHash;
    }

    async withdraw(srcAddress, amount, gasPrice="20") {
        const srcAmount = this.W.web3.utils.toWei(amount.toString());
        const hex = this.W.web3.utils.toHex;
        
        const withdrawTxData = await this.instance.methods.withdraw(srcAddress, srcAmount).encodeABI();
        const withdrawTxGas = await this.instance.methods.withdraw(srcAddress, srcAmount).estimateGas();

        const nonce = await this.W.getNonce();

        const txWithdraw = {
            from: this.W.getAddress(),
            nonce: hex(nonce),
            value: "0x0",
            to: this.markets.moneyMarket.address,
            gas: hex(withdrawTxGas),
            gasPrice: hex( this.W.web3.utils.toWei(gasPrice, 'gwei') ),
            data: withdrawTxData, 
        };

        const signedTx = this.W.signRawTx(txWithdraw);
        const withdrawTxHash = await this.W.sendSignedTransaction(signedTx);

        return withdrawTxHash;

    }


}

const cERC20ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"repayAmount","type":"uint256"}],"name":"repayBorrow","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"reserveFactorMantissa","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"}],"name":"borrowBalanceCurrent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"exchangeRateStored","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"borrower","type":"address"},{"name":"repayAmount","type":"uint256"}],"name":"repayBorrowBehalf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"pendingAdmin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOfUnderlying","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getCash","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newComptroller","type":"address"}],"name":"_setComptroller","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalBorrows","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"comptroller","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"reduceAmount","type":"uint256"}],"name":"_reduceReserves","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"initialExchangeRateMantissa","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"accrualBlockNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"underlying","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"totalBorrowsCurrent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"redeemAmount","type":"uint256"}],"name":"redeemUnderlying","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalReserves","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"borrowBalanceStored","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"mintAmount","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"accrueInterest","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"borrowIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"supplyRatePerBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"liquidator","type":"address"},{"name":"borrower","type":"address"},{"name":"seizeTokens","type":"uint256"}],"name":"seize","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newPendingAdmin","type":"address"}],"name":"_setPendingAdmin","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"exchangeRateCurrent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"getAccountSnapshot","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"borrowAmount","type":"uint256"}],"name":"borrow","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"redeemTokens","type":"uint256"}],"name":"redeem","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"_acceptAdmin","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newInterestRateModel","type":"address"}],"name":"_setInterestRateModel","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"interestRateModel","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"borrower","type":"address"},{"name":"repayAmount","type":"uint256"},{"name":"cTokenCollateral","type":"address"}],"name":"liquidateBorrow","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"borrowRatePerBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newReserveFactorMantissa","type":"uint256"}],"name":"_setReserveFactor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isCToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"underlying_","type":"address"},{"name":"comptroller_","type":"address"},{"name":"interestRateModel_","type":"address"},{"name":"initialExchangeRateMantissa_","type":"uint256"},{"name":"name_","type":"string"},{"name":"symbol_","type":"string"},{"name":"decimals_","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"interestAccumulated","type":"uint256"},{"indexed":false,"name":"borrowIndex","type":"uint256"},{"indexed":false,"name":"totalBorrows","type":"uint256"}],"name":"AccrueInterest","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"minter","type":"address"},{"indexed":false,"name":"mintAmount","type":"uint256"},{"indexed":false,"name":"mintTokens","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"redeemer","type":"address"},{"indexed":false,"name":"redeemAmount","type":"uint256"},{"indexed":false,"name":"redeemTokens","type":"uint256"}],"name":"Redeem","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"borrower","type":"address"},{"indexed":false,"name":"borrowAmount","type":"uint256"},{"indexed":false,"name":"accountBorrows","type":"uint256"},{"indexed":false,"name":"totalBorrows","type":"uint256"}],"name":"Borrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"payer","type":"address"},{"indexed":false,"name":"borrower","type":"address"},{"indexed":false,"name":"repayAmount","type":"uint256"},{"indexed":false,"name":"accountBorrows","type":"uint256"},{"indexed":false,"name":"totalBorrows","type":"uint256"}],"name":"RepayBorrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"liquidator","type":"address"},{"indexed":false,"name":"borrower","type":"address"},{"indexed":false,"name":"repayAmount","type":"uint256"},{"indexed":false,"name":"cTokenCollateral","type":"address"},{"indexed":false,"name":"seizeTokens","type":"uint256"}],"name":"LiquidateBorrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldPendingAdmin","type":"address"},{"indexed":false,"name":"newPendingAdmin","type":"address"}],"name":"NewPendingAdmin","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldAdmin","type":"address"},{"indexed":false,"name":"newAdmin","type":"address"}],"name":"NewAdmin","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldComptroller","type":"address"},{"indexed":false,"name":"newComptroller","type":"address"}],"name":"NewComptroller","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldInterestRateModel","type":"address"},{"indexed":false,"name":"newInterestRateModel","type":"address"}],"name":"NewMarketInterestRateModel","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldReserveFactorMantissa","type":"uint256"},{"indexed":false,"name":"newReserveFactorMantissa","type":"uint256"}],"name":"NewReserveFactor","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"admin","type":"address"},{"indexed":false,"name":"reduceAmount","type":"uint256"},{"indexed":false,"name":"newTotalReserves","type":"uint256"}],"name":"ReservesReduced","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"error","type":"uint256"},{"indexed":false,"name":"info","type":"uint256"},{"indexed":false,"name":"detail","type":"uint256"}],"name":"Failure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Approval","type":"event"}];

export default Compound2;