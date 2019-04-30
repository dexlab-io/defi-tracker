/* eslint-disable class-methods-use-this */
import BigNumber from 'bignumber.js';
import isUndefined from 'lodash/isUndefined';
import findIndex from 'lodash/findIndex';
import { erc20Abi } from '../../constants';

const ConvertFromWei = BigNumber(1000000000000000000)

class Maker {

    constructor(wallet) {
        this.W = wallet;
        this.CDPs = [];
    }

    async getState() {
        return await this.getCDPs();
    }

    findCDP(id) {
        if( isUndefined(id) || id === '' ) throw new Error(`contractAddress: is undefined`);
        let idx = findIndex(this.CDPs, (o) => { 
            return o.id.toString().toLowerCase().trim() === id.toString().toLowerCase().trim(); 
        });
        if( idx < 0) {
            this.CDPs.push(
                {
                    id
                }
            );

            idx = findIndex(this.portfolio, (o) => { 
                const idx = findIndex(this.CDPs, (o) => { 
                    return o.id.toString().toLowerCase().trim() === id.toString().toLowerCase().trim(); 
                });
            });
        }
        return idx;
    }

    async getCDPs() {
        return fetch(`https://mkr.tools/api/v1/lad/${this.W.getAddress()}`)
        .then(response => response.json())
        .then( async data => {
            data.forEach( o => {
                let cdpRisk;
                if (o.ratio < 150.00) {
                    cdpRisk = 'Liquidated';
                } else if (o.ratio < 200.00) {
                    cdpRisk = 'High';
                } else if (o.ratio < 250.00) {
                    cdpRisk = 'Medium';
                } else if (o.ratio < 299.00) {
                    cdpRisk = 'Safe-ish';
                } else if (o.ratio > 300.00) {
                    cdpRisk = 'Safe';
                }

                const idx = this.findCDP(o.id);
                this.CDPs[idx] = {
                    riskLabel: cdpRisk,
                    ...o
                };
            })
        })
    }
}

export default Maker;