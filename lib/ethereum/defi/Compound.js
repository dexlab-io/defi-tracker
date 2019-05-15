/* eslint-disable class-methods-use-this */
import isUndefined from 'lodash/isUndefined';
import findIndex from 'lodash/findIndex';

class Compound {
    constructor(wallet) {
        this.ERC20ABI = [{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"supply","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"digits","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]
        this.W = wallet;
        this.markets = {
                moneyMarket: { 
                    address: '0x3fda67f7583380e67ef93072294a7fac882fd7e7',
                    abi: 
                    [
                    {
                        "type": "function",
                        "stateMutability": "view",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "address",
                            "name": ""
                        }
                        ],
                        "name": "pendingAdmin",
                        "inputs": [],
                        "constant": true
                    },
                    {
                        "type": "function",
                        "stateMutability": "view",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "bool",
                            "name": ""
                        }
                        ],
                        "name": "paused",
                        "inputs": [],
                        "constant": true
                    },
                    {
                        "type": "function",
                        "stateMutability": "view",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "address",
                            "name": ""
                        }
                        ],
                        "name": "oracle",
                        "inputs": [],
                        "constant": true
                    },
                    {
                        "type": "function",
                        "stateMutability": "view",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "uint256",
                            "name": "mantissa"
                        }
                        ],
                        "name": "liquidationDiscount",
                        "inputs": [],
                        "constant": true
                    },
                    {
                        "type": "function",
                        "stateMutability": "view",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "bool",
                            "name": "isSupported"
                        },
                        {
                            "type": "uint256",
                            "name": "blockNumber"
                        },
                        {
                            "type": "address",
                            "name": "interestRateModel"
                        },
                        {
                            "type": "uint256",
                            "name": "totalSupply"
                        },
                        {
                            "type": "uint256",
                            "name": "supplyRateMantissa"
                        },
                        {
                            "type": "uint256",
                            "name": "supplyIndex"
                        },
                        {
                            "type": "uint256",
                            "name": "totalBorrows"
                        },
                        {
                            "type": "uint256",
                            "name": "borrowRateMantissa"
                        },
                        {
                            "type": "uint256",
                            "name": "borrowIndex"
                        }
                        ],
                        "name": "markets",
                        "inputs": [
                        {
                            "type": "address",
                            "name": ""
                        }
                        ],
                        "constant": true
                    },
                    {
                        "type": "function",
                        "stateMutability": "view",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "uint256",
                            "name": "mantissa"
                        }
                        ],
                        "name": "collateralRatio",
                        "inputs": [],
                        "constant": true
                    },
                    {
                        "type": "function",
                        "stateMutability": "view",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "uint256",
                            "name": "principal"
                        },
                        {
                            "type": "uint256",
                            "name": "interestIndex"
                        }
                        ],
                        "name": "supplyBalances",
                        "inputs": [
                        {
                            "type": "address",
                            "name": ""
                        },
                        {
                            "type": "address",
                            "name": ""
                        }
                        ],
                        "constant": true
                    },
                    {
                        "type": "function",
                        "stateMutability": "view",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "uint256",
                            "name": "mantissa"
                        }
                        ],
                        "name": "originationFee",
                        "inputs": [],
                        "constant": true
                    },
                    {
                        "type": "function",
                        "stateMutability": "view",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "address",
                            "name": ""
                        }
                        ],
                        "name": "collateralMarkets",
                        "inputs": [
                        {
                            "type": "uint256",
                            "name": ""
                        }
                        ],
                        "constant": true
                    },
                    {
                        "type": "function",
                        "stateMutability": "view",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "address",
                            "name": ""
                        }
                        ],
                        "name": "admin",
                        "inputs": [],
                        "constant": true
                    },
                    {
                        "type": "function",
                        "stateMutability": "view",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "uint256",
                            "name": "principal"
                        },
                        {
                            "type": "uint256",
                            "name": "interestIndex"
                        }
                        ],
                        "name": "borrowBalances",
                        "inputs": [
                        {
                            "type": "address",
                            "name": ""
                        },
                        {
                            "type": "address",
                            "name": ""
                        }
                        ],
                        "constant": true
                    },
                    {
                        "type": "constructor",
                        "stateMutability": "nonpayable",
                        "payable": false,
                        "inputs": []
                    },
                    {
                        "type": "fallback",
                        "stateMutability": "payable",
                        "payable": true
                    },
                    {
                        "type": "event",
                        "name": "SupplyReceived",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "account",
                            "indexed": false
                        },
                        {
                            "type": "address",
                            "name": "asset",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "amount",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "startingBalance",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "newBalance",
                            "indexed": false
                        }
                        ],
                        "anonymous": false
                    },
                    {
                        "type": "event",
                        "name": "SupplyWithdrawn",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "account",
                            "indexed": false
                        },
                        {
                            "type": "address",
                            "name": "asset",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "amount",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "startingBalance",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "newBalance",
                            "indexed": false
                        }
                        ],
                        "anonymous": false
                    },
                    {
                        "type": "event",
                        "name": "BorrowTaken",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "account",
                            "indexed": false
                        },
                        {
                            "type": "address",
                            "name": "asset",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "amount",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "startingBalance",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "borrowAmountWithFee",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "newBalance",
                            "indexed": false
                        }
                        ],
                        "anonymous": false
                    },
                    {
                        "type": "event",
                        "name": "BorrowRepaid",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "account",
                            "indexed": false
                        },
                        {
                            "type": "address",
                            "name": "asset",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "amount",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "startingBalance",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "newBalance",
                            "indexed": false
                        }
                        ],
                        "anonymous": false
                    },
                    {
                        "type": "event",
                        "name": "BorrowLiquidated",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "targetAccount",
                            "indexed": false
                        },
                        {
                            "type": "address",
                            "name": "assetBorrow",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "borrowBalanceBefore",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "borrowBalanceAccumulated",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "amountRepaid",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "borrowBalanceAfter",
                            "indexed": false
                        },
                        {
                            "type": "address",
                            "name": "liquidator",
                            "indexed": false
                        },
                        {
                            "type": "address",
                            "name": "assetCollateral",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "collateralBalanceBefore",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "collateralBalanceAccumulated",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "amountSeized",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "collateralBalanceAfter",
                            "indexed": false
                        }
                        ],
                        "anonymous": false
                    },
                    {
                        "type": "event",
                        "name": "NewPendingAdmin",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "oldPendingAdmin",
                            "indexed": false
                        },
                        {
                            "type": "address",
                            "name": "newPendingAdmin",
                            "indexed": false
                        }
                        ],
                        "anonymous": false
                    },
                    {
                        "type": "event",
                        "name": "NewAdmin",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "oldAdmin",
                            "indexed": false
                        },
                        {
                            "type": "address",
                            "name": "newAdmin",
                            "indexed": false
                        }
                        ],
                        "anonymous": false
                    },
                    {
                        "type": "event",
                        "name": "NewOracle",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "oldOracle",
                            "indexed": false
                        },
                        {
                            "type": "address",
                            "name": "newOracle",
                            "indexed": false
                        }
                        ],
                        "anonymous": false
                    },
                    {
                        "type": "event",
                        "name": "SupportedMarket",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "asset",
                            "indexed": false
                        },
                        {
                            "type": "address",
                            "name": "interestRateModel",
                            "indexed": false
                        }
                        ],
                        "anonymous": false
                    },
                    {
                        "type": "event",
                        "name": "NewRiskParameters",
                        "inputs": [
                        {
                            "type": "uint256",
                            "name": "oldCollateralRatioMantissa",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "newCollateralRatioMantissa",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "oldLiquidationDiscountMantissa",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "newLiquidationDiscountMantissa",
                            "indexed": false
                        }
                        ],
                        "anonymous": false
                    },
                    {
                        "type": "event",
                        "name": "NewOriginationFee",
                        "inputs": [
                        {
                            "type": "uint256",
                            "name": "oldOriginationFeeMantissa",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "newOriginationFeeMantissa",
                            "indexed": false
                        }
                        ],
                        "anonymous": false
                    },
                    {
                        "type": "event",
                        "name": "SetMarketInterestRateModel",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "asset",
                            "indexed": false
                        },
                        {
                            "type": "address",
                            "name": "interestRateModel",
                            "indexed": false
                        }
                        ],
                        "anonymous": false
                    },
                    {
                        "type": "event",
                        "name": "EquityWithdrawn",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "asset",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "equityAvailableBefore",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "amount",
                            "indexed": false
                        },
                        {
                            "type": "address",
                            "name": "owner",
                            "indexed": false
                        }
                        ],
                        "anonymous": false
                    },
                    {
                        "type": "event",
                        "name": "SuspendedMarket",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "asset",
                            "indexed": false
                        }
                        ],
                        "anonymous": false
                    },
                    {
                        "type": "event",
                        "name": "SetPaused",
                        "inputs": [
                        {
                            "type": "bool",
                            "name": "newState",
                            "indexed": false
                        }
                        ],
                        "anonymous": false
                    },
                    {
                        "type": "event",
                        "name": "Failure",
                        "inputs": [
                        {
                            "type": "uint256",
                            "name": "error",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "info",
                            "indexed": false
                        },
                        {
                            "type": "uint256",
                            "name": "detail",
                            "indexed": false
                        }
                        ],
                        "anonymous": false
                    },
                    {
                        "type": "function",
                        "stateMutability": "view",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "uint256",
                            "name": ""
                        }
                        ],
                        "name": "getCollateralMarketsLength",
                        "inputs": [],
                        "constant": true
                    },
                    {
                        "type": "function",
                        "stateMutability": "view",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "uint256",
                            "name": ""
                        }
                        ],
                        "name": "assetPrices",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "asset"
                        }
                        ],
                        "constant": true
                    },
                    {
                        "type": "function",
                        "stateMutability": "nonpayable",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "uint256",
                            "name": ""
                        }
                        ],
                        "name": "_setPendingAdmin",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "newPendingAdmin"
                        }
                        ],
                        "constant": false
                    },
                    {
                        "type": "function",
                        "stateMutability": "nonpayable",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "uint256",
                            "name": ""
                        }
                        ],
                        "name": "_acceptAdmin",
                        "inputs": [],
                        "constant": false
                    },
                    {
                        "type": "function",
                        "stateMutability": "nonpayable",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "uint256",
                            "name": ""
                        }
                        ],
                        "name": "_setOracle",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "newOracle"
                        }
                        ],
                        "constant": false
                    },
                    {
                        "type": "function",
                        "stateMutability": "nonpayable",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "uint256",
                            "name": ""
                        }
                        ],
                        "name": "_setPaused",
                        "inputs": [
                        {
                            "type": "bool",
                            "name": "requestedState"
                        }
                        ],
                        "constant": false
                    },
                    {
                        "type": "function",
                        "stateMutability": "view",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "int256",
                            "name": ""
                        }
                        ],
                        "name": "getAccountLiquidity",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "account"
                        }
                        ],
                        "constant": true
                    },
                    {
                        "type": "function",
                        "stateMutability": "view",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "uint256",
                            "name": ""
                        }
                        ],
                        "name": "getSupplyBalance",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "account"
                        },
                        {
                            "type": "address",
                            "name": "asset"
                        }
                        ],
                        "constant": true
                    },
                    {
                        "type": "function",
                        "stateMutability": "view",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "uint256",
                            "name": ""
                        }
                        ],
                        "name": "getBorrowBalance",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "account"
                        },
                        {
                            "type": "address",
                            "name": "asset"
                        }
                        ],
                        "constant": true
                    },
                    {
                        "type": "function",
                        "stateMutability": "nonpayable",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "uint256",
                            "name": ""
                        }
                        ],
                        "name": "_supportMarket",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "asset"
                        },
                        {
                            "type": "address",
                            "name": "interestRateModel"
                        }
                        ],
                        "constant": false
                    },
                    {
                        "type": "function",
                        "stateMutability": "nonpayable",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "uint256",
                            "name": ""
                        }
                        ],
                        "name": "_suspendMarket",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "asset"
                        }
                        ],
                        "constant": false
                    },
                    {
                        "type": "function",
                        "stateMutability": "nonpayable",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "uint256",
                            "name": ""
                        }
                        ],
                        "name": "_setRiskParameters",
                        "inputs": [
                        {
                            "type": "uint256",
                            "name": "collateralRatioMantissa"
                        },
                        {
                            "type": "uint256",
                            "name": "liquidationDiscountMantissa"
                        }
                        ],
                        "constant": false
                    },
                    {
                        "type": "function",
                        "stateMutability": "nonpayable",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "uint256",
                            "name": ""
                        }
                        ],
                        "name": "_setOriginationFee",
                        "inputs": [
                        {
                            "type": "uint256",
                            "name": "originationFeeMantissa"
                        }
                        ],
                        "constant": false
                    },
                    {
                        "type": "function",
                        "stateMutability": "nonpayable",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "uint256",
                            "name": ""
                        }
                        ],
                        "name": "_setMarketInterestRateModel",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "asset"
                        },
                        {
                            "type": "address",
                            "name": "interestRateModel"
                        }
                        ],
                        "constant": false
                    },
                    {
                        "type": "function",
                        "stateMutability": "nonpayable",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "uint256",
                            "name": ""
                        }
                        ],
                        "name": "_withdrawEquity",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "asset"
                        },
                        {
                            "type": "uint256",
                            "name": "amount"
                        }
                        ],
                        "constant": false
                    },
                    {
                        "type": "function",
                        "stateMutability": "nonpayable",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "uint256",
                            "name": ""
                        }
                        ],
                        "name": "supply",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "asset"
                        },
                        {
                            "type": "uint256",
                            "name": "amount"
                        }
                        ],
                        "constant": false
                    },
                    {
                        "type": "function",
                        "stateMutability": "nonpayable",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "uint256",
                            "name": ""
                        }
                        ],
                        "name": "withdraw",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "asset"
                        },
                        {
                            "type": "uint256",
                            "name": "requestedAmount"
                        }
                        ],
                        "constant": false
                    },
                    {
                        "type": "function",
                        "stateMutability": "view",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "uint256",
                            "name": ""
                        },
                        {
                            "type": "uint256",
                            "name": ""
                        },
                        {
                            "type": "uint256",
                            "name": ""
                        }
                        ],
                        "name": "calculateAccountValues",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "userAddress"
                        }
                        ],
                        "constant": true
                    },
                    {
                        "type": "function",
                        "stateMutability": "nonpayable",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "uint256",
                            "name": ""
                        }
                        ],
                        "name": "repayBorrow",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "asset"
                        },
                        {
                            "type": "uint256",
                            "name": "amount"
                        }
                        ],
                        "constant": false
                    },
                    {
                        "type": "function",
                        "stateMutability": "nonpayable",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "uint256",
                            "name": ""
                        }
                        ],
                        "name": "liquidateBorrow",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "targetAccount"
                        },
                        {
                            "type": "address",
                            "name": "assetBorrow"
                        },
                        {
                            "type": "address",
                            "name": "assetCollateral"
                        },
                        {
                            "type": "uint256",
                            "name": "requestedAmountClose"
                        }
                        ],
                        "constant": false
                    },
                    {
                        "type": "function",
                        "stateMutability": "nonpayable",
                        "payable": false,
                        "outputs": [
                        {
                            "type": "uint256",
                            "name": ""
                        }
                        ],
                        "name": "borrow",
                        "inputs": [
                        {
                            "type": "address",
                            "name": "asset"
                        },
                        {
                            "type": "uint256",
                            "name": "amount"
                        }
                        ],
                        "constant": false
                    }
                    ]}
            }

        this.instance = new this.W.web3.eth.Contract(this.markets.moneyMarket.abi, this.markets.moneyMarket.address);
        this.portfolio = [
            { contractAddress: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359', name: 'DAI', symbol:'DAI'},
            { contractAddress: '0xe41d2489571d322189246dafa5ebde1f4699f498', name: 'ZRX', symbol:'ZRX'},
            { contractAddress: '0x0d8775f648430679a709e98d2b0cb6250d2887ef', name: 'BAT', symbol:'BAT'},
            { contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', name: 'WETH', symbol:'WETH'},
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

    async getMarket(market) {
        const marketData = await this.instance.methods.markets(market).call();
        return marketData;
    }

    calculateApr(rateMantissa) {
        const BLOCKS_PER_YEAR = 2102400;
        const APR = ((rateMantissa * BLOCKS_PER_YEAR) / 1e18) * 100;
        return APR.toFixed(2);
    }
    
    async getTokenState(contractAddress) {
        const idx = this.findToken(contractAddress);
        this.portfolio[idx].supplyAmount = await this.getSupplyBalance(this.portfolio[idx].contractAddress);
        this.portfolio[idx].supplyBalances = await this.getSupplyBalances(this.portfolio[idx].contractAddress);
        this.portfolio[idx].earned = this.getYouEarned(this.portfolio[idx].supplyBalances.principal, this.portfolio[idx].supplyAmount)
        this.portfolio[idx].market = await this.getMarket(this.portfolio[idx].contractAddress)
        this.portfolio[idx].apr = this.calculateApr(this.portfolio[idx].market.supplyRateMantissa);
        this.portfolio[idx].price = await this.W.getTokenInfo(this.portfolio[idx]);

        return this.portfolio[idx];
    }

    async getState() {
        const promises = this.portfolio.map(async t => this.getTokenState(t.contractAddress));
        await Promise.all(promises)
    }

    async getSupplyBalances(tokenAddress) {
        const supplyBalances = await this.instance.methods.supplyBalances(this.W.getAddress(), tokenAddress).call();
        return supplyBalances;
    }

    async getSupplyBalance(tokenAddress) {
        const weiBalance = await this.instance.methods.getSupplyBalance(this.W.getAddress(), tokenAddress).call();
        const value = this.W.web3.utils.fromWei(weiBalance.toString(), 'ether');
        const bn = parseFloat(value).toFixed(2).toString();
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

export default Compound;