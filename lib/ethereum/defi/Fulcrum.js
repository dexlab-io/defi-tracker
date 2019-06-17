/* eslint-disable no-use-before-define */
/* eslint-disable class-methods-use-this */
import isUndefined from 'lodash/isUndefined';
import findIndex from 'lodash/findIndex';
import BigNumber from 'bignumber.js';

class Fulcrum {
    constructor(wallet) {
        this.W = wallet;

        this.cacheApi = null;
        this.portfolio = [
            { contractAddress: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359', iTokenAddress:"0x14094949152eddbfcd073717200da82fed8dc960", name: 'DAI', symbol:'DAI', decimals:18, supplyAmount: null, api: null},
            // { contractAddress: '0xe41d2489571d322189246dafa5ebde1f4699f498', cTokenAddress:"0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407", name: 'ZRX', symbol:'ZRX', decimals:18, supplyAmount: null, api: null},
            // { contractAddress: '0x0d8775f648430679a709e98d2b0cb6250d2887ef', cTokenAddress:"0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e", name: 'BAT', symbol:'BAT', decimals:18, supplyAmount: null, api: null},
            // { contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', cTokenAddress:"0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5", name: 'WETH', symbol:'WETH', decimals:18, supplyAmount: null, api: null},
            // { contractAddress: '0x1985365e9f78359a9B6AD760e32412f4a445E862', cTokenAddress:"0x158079ee67fce2f58472a96584a73c7ab9ac95c1", name: 'REP', symbol:'REP', decimals:18, supplyAmount: null, api: null},
            { contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', iTokenAddress:"0xf013406a0b1d544238083df0b93ad0d2cbe0f65f", name: 'USDC', symbol:'USDC', decimals:6, supplyAmount: null, api: null},
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

    findTokenByiAddress(contractAddress) {
        if( isUndefined(contractAddress) || contractAddress === '' ) throw new Error(`contractAddress: is undefined`);
        const idx = findIndex(this.portfolio, (o) => { 
            return o.iTokenAddress.toString().toLowerCase().trim() === contractAddress.toString().toLowerCase().trim(); 
        });
        if( idx < 0) {
            return false;
        }
        return idx;
    }


    async getEarned(tokenAddress) {
        const idx = this.findToken(tokenAddress);
        const iToken = new this.W.web3.eth.Contract(iTokenABI, this.portfolio[idx].iTokenAddress);

        const currentPrice = await iToken.methods.tokenPrice().call() / 1e18;
        const checkpointPrice = await iToken.methods.checkpointPrice(this.W.getAddress()).call() / 1e18;
        const weiBalance = await iToken.methods.balanceOf(this.W.getAddress()).call() / 1e18;

        const earned = ((currentPrice - checkpointPrice) * weiBalance).toFixed(4);
        return earned;
    }


    async getTokenPrice(tokenAddress) {
        const idx = this.findToken(tokenAddress);
        const iToken = new this.W.web3.eth.Contract(iTokenABI, this.portfolio[idx].iTokenAddress);

        const currentPrice = await iToken.methods.tokenPrice().call() / 1e18;
        return currentPrice;
    }
    
    async getTokenState(contractAddress) {
        
        const idx = this.findToken(contractAddress);
        
        try {
            this.portfolio[idx].supplyAmount = await this.getSupplyBalance(this.portfolio[idx].contractAddress);
            this.portfolio[idx].supplyRateMantissa = await this.getMarketInfo(this.portfolio[idx].contractAddress);
            this.portfolio[idx].apr = this.portfolio[idx].supplyRateMantissa.toFixed(4);
            this.portfolio[idx].price = await this.W.getTokenInfo(this.portfolio[idx]);
            this.portfolio[idx].earned = await this.getEarned(this.portfolio[idx].contractAddress);

        } catch(e) { console.log('FULCRUM', e)}

        return idx;
    }

    async getMarketInfo(tokenAddress) {
        const idx = this.findToken(tokenAddress);
        const iToken = new this.W.web3.eth.Contract(iTokenABI, this.portfolio[idx].iTokenAddress);
        const supplyRate = (await iToken.methods.supplyInterestRate().call()) / 1e18;
        return supplyRate;
    }

    async getState() {
        const promises = this.portfolio.map(async t => this.getTokenState(t.contractAddress));
        await Promise.all(promises)
    }

    async getSupplyBalance(tokenAddress) {
        const idx = this.findToken(tokenAddress);
        const iToken = new this.W.web3.eth.Contract(iTokenABI, this.portfolio[idx].iTokenAddress);
        const weiBalance = await iToken.methods.balanceOf(this.W.getAddress()).call();
        const balanceOfUnderlying = await iToken.methods.assetBalanceOf(this.W.getAddress()).call();
        const bn = parseFloat(balanceOfUnderlying / Number(`1e${this.portfolio[idx].decimals}`) ).toFixed(2).toString();

        return {
            wei: weiBalance,
            weiOfUnderlying: balanceOfUnderlying,
            text: bn.toString()
        }
    }

    async mint(iTokenAddress, amount, gasPrice="20") {
        const srcAmount = this.W.web3.utils.toWei(amount.toString());
        const hex = this.W.web3.utils.toHex;
        const address = this.W.getAddress();

        const iToken = new this.W.web3.eth.Contract(iTokenABI, iTokenAddress);
        const supplyTxData = await iToken.methods.mint(address, srcAmount).encodeABI();
        const supplyTxGas = await iToken.methods.mint(address, srcAmount).estimateGas();

        const nonce = await this.W.getNonce();

        const txSupply = {
            from: this.W.getAddress(),
            nonce: hex(nonce),
            value: "0x0",
            to: iTokenAddress,
            gas: hex(supplyTxGas),
            gasPrice: hex( this.W.web3.utils.toWei(gasPrice.toString(), 'gwei') ),
            data: supplyTxData, 
        };

        const signedTx = this.W.signRawTx(txSupply);

        const supplyTxHash = await this.W.sendSignedTransaction(signedTx);
        return supplyTxHash;
    }


    async burn(iTokenAddress, amount, gasPrice="20") {
        const srcAmount = amount;
        const hex = this.W.web3.utils.toHex;
        const address = this.W.getAddress();

        const iToken = new this.W.web3.eth.Contract(iTokenABI, iTokenAddress);
        const supplyTxData = await iToken.methods.burn(address, srcAmount).encodeABI();
        const supplyTxGas = await iToken.methods.burn(address, srcAmount).estimateGas();

        const gasPlus20percent = supplyTxGas + Math.round(supplyTxGas / 100 * 20);

        const nonce = await this.W.getNonce();

        const txSupply = {
            from: this.W.getAddress(),
            nonce: hex(nonce),
            value: "0x0",
            to: iTokenAddress,
            gas: hex(gasPlus20percent),
            gasPrice: hex( this.W.web3.utils.toWei(gasPrice.toString(), 'gwei') ),
            data: supplyTxData, 
        };

        const signedTx = this.W.signRawTx(txSupply);

        const supplyTxHash = await this.W.sendSignedTransaction(signedTx);
        return supplyTxHash;
    }

    async redeemUnderlying(contractAddress, amount, gasPrice="20") {
        const srcAmount = this.W.web3.utils.toWei(amount.toString());
        const price = await this.getTokenPrice(contractAddress);
        
        const toBurn = (parseFloat(srcAmount) / parseFloat(price)).toString();

        console.log({
            price,
            srcAmount,
            toBurn
        })


        const idx = this.findToken(contractAddress);
        return this.burn(this.portfolio[idx].iTokenAddress, toBurn, gasPrice);

    }


}

const iTokenABI = [{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"assetBalanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"claimLoanToken","outputs":[{"name":"claimedAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"supplyInterestRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"burntTokenReserved","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"borrowAmount","type":"uint256"},{"name":"leverageAmount","type":"uint256"},{"name":"collateralTokenAddress","type":"address"},{"name":"tradeTokenToFillAddress","type":"address"},{"name":"withdrawOnOpen","type":"bool"}],"name":"borrowToken","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"setWETHContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"setTokenizedRegistry","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"initialPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"baseRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalAssetBorrow","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"escrowAmount","type":"uint256"},{"name":"leverageAmount","type":"uint256"},{"name":"tradeTokenToFillAddress","type":"address"},{"name":"withdrawOnOpen","type":"bool"}],"name":"borrowTokenFromEscrow","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"loanOrderData","outputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"leverageAmount","type":"uint256"},{"name":"initialMarginAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"},{"name":"maxDurationUnixTimestampSec","type":"uint256"},{"name":"index","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"orderParams","type":"uint256[4]"}],"name":"initLeverage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"setBZxVault","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getLeverageList","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"leverageAmount","type":"uint256"}],"name":"removeLeverage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"rateMultiplier","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_baseRate","type":"uint256"},{"name":"_rateMultiplier","type":"uint256"}],"name":"setDemandCurve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"receiver","type":"address"},{"name":"depositAmount","type":"uint256"}],"name":"mint","outputs":[{"name":"mintAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"wethContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_bZxContract","type":"address"},{"name":"_bZxVault","type":"address"},{"name":"_bZxOracle","type":"address"},{"name":"_loanTokenAddress","type":"address"},{"name":"_tokenizedRegistry","type":"address"},{"name":"_name","type":"string"},{"name":"_symbol","type":"string"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tokenAddress","type":"address"}],"name":"donateAsset","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"marketLiquidity","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"levergeAmount","type":"uint256"}],"name":"getLoanData","outputs":[{"components":[{"name":"loanOrderHash","type":"bytes32"},{"name":"leverageAmount","type":"uint256"},{"name":"initialMarginAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"},{"name":"maxDurationUnixTimestampSec","type":"uint256"},{"name":"index","type":"uint256"}],"name":"","type":"tuple"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalReservedSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"interestReceived","outputs":[{"name":"interestTotalAccrued","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"wrapEther","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenizedRegistry","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"burntTokenReserveList","outputs":[{"name":"lender","type":"address"},{"name":"amount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"loanTokenAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenPrice","outputs":[{"name":"price","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"receiver","type":"address"},{"name":"burnAmount","type":"uint256"}],"name":"burnToEther","outputs":[{"name":"loanAmountPaid","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"leverageAmount","type":"uint256"}],"name":"getMaxEscrowAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"borrowInterestRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bZxVault","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"escrowAmount","type":"uint256"},{"name":"leverageAmount","type":"uint256"},{"name":"withdrawOnOpen","type":"bool"}],"name":"getBorrowAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newRate","type":"uint256"}],"name":"setInterestFeePercent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"receiver","type":"address"}],"name":"mintWithEther","outputs":[{"name":"mintAmount","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"totalAssetSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bZxOracle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bZxContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"leverageList","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"receiver","type":"address"},{"name":"burnAmount","type":"uint256"}],"name":"burn","outputs":[{"name":"loanAmountPaid","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"setInitialPrice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"setBZxOracle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"borrowAmount","type":"uint256"}],"name":"nextLoanInterestRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"borrower","type":"address"},{"name":"loanOrderHash","type":"bytes32"},{"name":"initialMarginAmount","type":"uint256"},{"name":"escrowAmount","type":"uint256"},{"name":"maxDuration","type":"uint256"},{"name":"tradeTokenToFillAddress","type":"address"}],"name":"rolloverPosition","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"components":[{"name":"loanTokenAddress","type":"address"},{"name":"interestTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"oracleAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"interestAmount","type":"uint256"},{"name":"initialMarginAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"},{"name":"maxDurationUnixTimestampSec","type":"uint256"},{"name":"loanOrderHash","type":"bytes32"}],"name":"loanOrder","type":"tuple"},{"components":[{"name":"trader","type":"address"},{"name":"collateralTokenAddressFilled","type":"address"},{"name":"positionTokenAddressFilled","type":"address"},{"name":"loanTokenAmountFilled","type":"uint256"},{"name":"loanTokenAmountUsed","type":"uint256"},{"name":"collateralTokenAmountFilled","type":"uint256"},{"name":"positionTokenAmountFilled","type":"uint256"},{"name":"loanStartUnixTimestampSec","type":"uint256"},{"name":"loanEndUnixTimestampSec","type":"uint256"},{"name":"active","type":"bool"},{"name":"positionId","type":"uint256"}],"name":"loanPosition","type":"tuple"},{"name":"loanCloser","type":"address"},{"name":"closeAmount","type":"uint256"},{"name":"","type":"bool"}],"name":"closeLoanNotifier","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"spreadMultiplier","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"setBZxContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"checkpointPrice","outputs":[{"name":"price","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"burntTokenReserveListIndex","outputs":[{"name":"index","type":"uint256"},{"name":"isSet","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"loanOrderHashes","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"settleInterest","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"minter","type":"address"},{"indexed":false,"name":"tokenAmount","type":"uint256"},{"indexed":false,"name":"assetAmount","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"tokenAmount","type":"uint256"},{"indexed":false,"name":"assetAmount","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"borrower","type":"address"},{"indexed":false,"name":"borrowAmount","type":"uint256"},{"indexed":false,"name":"interestRate","type":"uint256"},{"indexed":false,"name":"collateralTokenAddress","type":"address"},{"indexed":false,"name":"tradeTokenToFillAddress","type":"address"},{"indexed":false,"name":"withdrawOnOpen","type":"bool"}],"name":"Borrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"claimant","type":"address"},{"indexed":false,"name":"tokenAmount","type":"uint256"},{"indexed":false,"name":"assetAmount","type":"uint256"},{"indexed":false,"name":"remainingTokenAmount","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"}],"name":"Claim","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}]

export default Fulcrum;