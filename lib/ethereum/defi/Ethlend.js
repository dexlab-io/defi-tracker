class Ethlend {
    constructor(wallet) {
        this.W = wallet;
        this.markets = [];

        this.portfolio = {
            totalBalanceUSD: 0,
            totalCollateralUSD: 0,
            avgLendApr: 0
        };
    }

    async getState() {

        return fetch(`https://api.aave.com/stats/userdata/${this.W.getAddress()}`)
        .then(response => response.json())
        .then( async data => {
            this.portfolio.totalBalanceUSD =  data.totalBalanceUSD;
            this.portfolio.totalCollateralUSD =  data.totalCollateralUSD;
            this.portfolio.avgLendApr =  data.avgLendApr;
        })
    }
}

export default Ethlend;