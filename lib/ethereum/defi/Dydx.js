/* eslint-disable class-methods-use-this */
import BigNumber from 'bignumber.js';

class Dydx {
    constructor(wallet) {
        this.W = wallet;
        this.markets = [];
        this.accountUuid = null;

        this.portfolio = [
            { contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', decimals:18, name: 'WETH', symbol:'WETH'},
            { contractAddress: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359', decimals:18, name: 'DAI', symbol:'DAI'},
            { contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', decimals:6, name: 'USDC', symbol:'USDC'},
        ];
    }

    async getState() {
        await this.getMarkets();

        return fetch(`https://api.dydx.exchange/v1/accounts/${this.W.getAddress()}`)
        .then(response => response.json())
        .then( async data => {

            if(data.accounts.length === 0 ){
                this.portfolio[0].balanceWei = 0;
                this.portfolio[0].par = 0;
                this.portfolio[0].balance = 0;;
                this.portfolio[0].APY = 0;
    
                // DAI
                this.portfolio[1].balanceWei = 0;
                this.portfolio[1].par = 0;
                this.portfolio[1].balance = 0;;
                this.portfolio[1].APY = 0;

                this.portfolio[2].balanceWei = 0;
                this.portfolio[2].par = 0;
                this.portfolio[2].balance = 0;;
                this.portfolio[2].APY = 0;
                return;
            }
            // WETH
            this.portfolio[0].balanceWei = data.accounts[0].balances[0].wei;
            this.portfolio[0].par = data.accounts[0].balances[0].par;
            this.portfolio[0].balance = parseFloat( this.portfolio[0].balanceWei ) / 1e18;
            this.portfolio[0].APY = parseFloat(this.markets[0].totalSupplyAPY) * 100;

            // DAI
            this.portfolio[1].balanceWei = data.accounts[0].balances[1].wei;
            this.portfolio[1].balance = parseFloat( this.portfolio[1].balanceWei ) / 1e18;
            this.portfolio[1].par = data.accounts[0].balances[1].par;
            this.portfolio[1].APY = parseFloat(this.markets[1].totalSupplyAPY) * 100;

            // USDC
            this.portfolio[2].balanceWei = data.accounts[0].balances[2].wei;
            this.portfolio[2].balance = parseFloat( data.accounts[0].balances[2].wei ) / Number(`1e${this.portfolio[2].decimals}`);
            this.portfolio[2].par = data.accounts[0].balances[2].par;
            this.portfolio[2].APY = parseFloat(this.markets[2].totalSupplyAPY) * 100;

            this.accountUuid = data.accountUuids[0];

            await this.getAccountOperations();
        })
    }

    async getAccountOperations() {
        return fetch(`https://api.dydx.exchange/v1/operations?accountUuids=${this.accountUuid}`)
        .then(response => response.json())
        .then( async data => {
            const marketsLended = 
            [
                new BigNumber(0),
                new BigNumber(0),
                new BigNumber(0),
            ]


            data.operations.forEach( op => {
                op.actions.forEach( o => {
                    if(o.type === 'DEPOSIT' || o.type === 'WITHDRAW') {
                        const b = o.balanceUpdates[0];
                        marketsLended[b.marketId] = marketsLended[b.marketId].plus(b.deltaWei)
                    }
                })
            })

            // WETH
            this.portfolio[ 0 ].lendedWei = marketsLended[0].toString();
            this.portfolio[ 0 ].earnedWei = new BigNumber( this.portfolio[ 0 ].balanceWei ).minus( marketsLended[0] ).toString();
            this.portfolio[ 0 ].lended = parseFloat( marketsLended[0].dividedBy(1e18).toString() );
            this.portfolio[ 0 ].earned = parseFloat(this.portfolio[ 0 ].earnedWei) / 1e18;
            this.portfolio[ 0 ].price = await this.W.getTokenInfo(this.portfolio[0]);

            // DAI
            this.portfolio[ 1 ].lendedWei = marketsLended[1].toString();
            this.portfolio[ 1 ].earnedWei = new BigNumber( this.portfolio[ 1 ].balanceWei ).minus( marketsLended[1] ).toString();
            this.portfolio[ 1 ].lended = parseFloat( marketsLended[1].dividedBy(1e18).toString() );
            this.portfolio[ 1 ].earned = parseFloat(this.portfolio[ 1 ].earnedWei) / 1e18;
            this.portfolio[ 1 ].price = await this.W.getTokenInfo(this.portfolio[1]);

            // USDC
            this.portfolio[ 2 ].lendedWei = marketsLended[2].toString();
            this.portfolio[ 2 ].earnedWei = new BigNumber( this.portfolio[ 2 ].balanceWei ).minus( marketsLended[2] ).toString();
            this.portfolio[ 2 ].lended = parseFloat( marketsLended[2].dividedBy(1e18).toString() );
            this.portfolio[ 2 ].earned = parseFloat(this.portfolio[ 2 ].earnedWei) / 1e18;
            this.portfolio[ 2 ].price = await this.W.getTokenInfo(this.portfolio[2]);

            // console.log('this.portfolio', this.portfolio)

        })
    }

    async getMarkets() {
        return fetch(`https://api.dydx.exchange/v1/markets`)
        .then(response => response.json())
        .then( async data => {
            // console.log('Dydx getMarkets DATA', data);
            this.markets = data.markets;
        })
    }

}

export default Dydx;