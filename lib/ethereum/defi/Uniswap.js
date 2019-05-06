/* eslint-disable class-methods-use-this */
import BigNumber from 'bignumber.js';
import isUndefined from 'lodash/isUndefined';
import findIndex from 'lodash/findIndex';
import { erc20Abi } from '../../constants';

const ConvertFromWei = BigNumber(1000000000000000000)

/**
 * https://www.daiprice.info/
 * https://github.com/Alexintosh/daistats
 * https://defipulse.com/
 * https://dai.stablecoin.science/
 */
class Uniswap {
    constructor(wallet) {
        this.exchangeABI = [{"name": "TokenPurchase", "inputs": [{"type": "address", "name": "buyer", "indexed": true}, {"type": "uint256", "name": "eth_sold", "indexed": true}, {"type": "uint256", "name": "tokens_bought", "indexed": true}], "anonymous": false, "type": "event"}, {"name": "EthPurchase", "inputs": [{"type": "address", "name": "buyer", "indexed": true}, {"type": "uint256", "name": "tokens_sold", "indexed": true}, {"type": "uint256", "name": "eth_bought", "indexed": true}], "anonymous": false, "type": "event"}, {"name": "AddLiquidity", "inputs": [{"type": "address", "name": "provider", "indexed": true}, {"type": "uint256", "name": "eth_amount", "indexed": true}, {"type": "uint256", "name": "token_amount", "indexed": true}], "anonymous": false, "type": "event"}, {"name": "RemoveLiquidity", "inputs": [{"type": "address", "name": "provider", "indexed": true}, {"type": "uint256", "name": "eth_amount", "indexed": true}, {"type": "uint256", "name": "token_amount", "indexed": true}], "anonymous": false, "type": "event"}, {"name": "Transfer", "inputs": [{"type": "address", "name": "_from", "indexed": true}, {"type": "address", "name": "_to", "indexed": true}, {"type": "uint256", "name": "_value", "indexed": false}], "anonymous": false, "type": "event"}, {"name": "Approval", "inputs": [{"type": "address", "name": "_owner", "indexed": true}, {"type": "address", "name": "_spender", "indexed": true}, {"type": "uint256", "name": "_value", "indexed": false}], "anonymous": false, "type": "event"}, {"name": "setup", "outputs": [], "inputs": [{"type": "address", "name": "token_addr"}], "constant": false, "payable": false, "type": "function", "gas": 175875}, {"name": "addLiquidity", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "min_liquidity"}, {"type": "uint256", "name": "max_tokens"}, {"type": "uint256", "name": "deadline"}], "constant": false, "payable": true, "type": "function", "gas": 82605}, {"name": "removeLiquidity", "outputs": [{"type": "uint256", "name": "out"}, {"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "amount"}, {"type": "uint256", "name": "min_eth"}, {"type": "uint256", "name": "min_tokens"}, {"type": "uint256", "name": "deadline"}], "constant": false, "payable": false, "type": "function", "gas": 116814}, {"name": "__default__", "outputs": [], "inputs": [], "constant": false, "payable": true, "type": "function"}, {"name": "ethToTokenSwapInput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "min_tokens"}, {"type": "uint256", "name": "deadline"}], "constant": false, "payable": true, "type": "function", "gas": 12757}, {"name": "ethToTokenTransferInput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "min_tokens"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "recipient"}], "constant": false, "payable": true, "type": "function", "gas": 12965}, {"name": "ethToTokenSwapOutput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_bought"}, {"type": "uint256", "name": "deadline"}], "constant": false, "payable": true, "type": "function", "gas": 50455}, {"name": "ethToTokenTransferOutput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_bought"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "recipient"}], "constant": false, "payable": true, "type": "function", "gas": 50663}, {"name": "tokenToEthSwapInput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_sold"}, {"type": "uint256", "name": "min_eth"}, {"type": "uint256", "name": "deadline"}], "constant": false, "payable": false, "type": "function", "gas": 47503}, {"name": "tokenToEthTransferInput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_sold"}, {"type": "uint256", "name": "min_eth"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "recipient"}], "constant": false, "payable": false, "type": "function", "gas": 47712}, {"name": "tokenToEthSwapOutput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "eth_bought"}, {"type": "uint256", "name": "max_tokens"}, {"type": "uint256", "name": "deadline"}], "constant": false, "payable": false, "type": "function", "gas": 50175}, {"name": "tokenToEthTransferOutput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "eth_bought"}, {"type": "uint256", "name": "max_tokens"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "recipient"}], "constant": false, "payable": false, "type": "function", "gas": 50384}, {"name": "tokenToTokenSwapInput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_sold"}, {"type": "uint256", "name": "min_tokens_bought"}, {"type": "uint256", "name": "min_eth_bought"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "token_addr"}], "constant": false, "payable": false, "type": "function", "gas": 51007}, {"name": "tokenToTokenTransferInput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_sold"}, {"type": "uint256", "name": "min_tokens_bought"}, {"type": "uint256", "name": "min_eth_bought"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "recipient"}, {"type": "address", "name": "token_addr"}], "constant": false, "payable": false, "type": "function", "gas": 51098}, {"name": "tokenToTokenSwapOutput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_bought"}, {"type": "uint256", "name": "max_tokens_sold"}, {"type": "uint256", "name": "max_eth_sold"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "token_addr"}], "constant": false, "payable": false, "type": "function", "gas": 54928}, {"name": "tokenToTokenTransferOutput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_bought"}, {"type": "uint256", "name": "max_tokens_sold"}, {"type": "uint256", "name": "max_eth_sold"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "recipient"}, {"type": "address", "name": "token_addr"}], "constant": false, "payable": false, "type": "function", "gas": 55019}, {"name": "tokenToExchangeSwapInput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_sold"}, {"type": "uint256", "name": "min_tokens_bought"}, {"type": "uint256", "name": "min_eth_bought"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "exchange_addr"}], "constant": false, "payable": false, "type": "function", "gas": 49342}, {"name": "tokenToExchangeTransferInput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_sold"}, {"type": "uint256", "name": "min_tokens_bought"}, {"type": "uint256", "name": "min_eth_bought"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "recipient"}, {"type": "address", "name": "exchange_addr"}], "constant": false, "payable": false, "type": "function", "gas": 49532}, {"name": "tokenToExchangeSwapOutput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_bought"}, {"type": "uint256", "name": "max_tokens_sold"}, {"type": "uint256", "name": "max_eth_sold"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "exchange_addr"}], "constant": false, "payable": false, "type": "function", "gas": 53233}, {"name": "tokenToExchangeTransferOutput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_bought"}, {"type": "uint256", "name": "max_tokens_sold"}, {"type": "uint256", "name": "max_eth_sold"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "recipient"}, {"type": "address", "name": "exchange_addr"}], "constant": false, "payable": false, "type": "function", "gas": 53423}, {"name": "getEthToTokenInputPrice", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "eth_sold"}], "constant": true, "payable": false, "type": "function", "gas": 5542}, {"name": "getEthToTokenOutputPrice", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_bought"}], "constant": true, "payable": false, "type": "function", "gas": 6872}, {"name": "getTokenToEthInputPrice", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_sold"}], "constant": true, "payable": false, "type": "function", "gas": 5637}, {"name": "getTokenToEthOutputPrice", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "eth_bought"}], "constant": true, "payable": false, "type": "function", "gas": 6897}, {"name": "tokenAddress", "outputs": [{"type": "address", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 1413}, {"name": "factoryAddress", "outputs": [{"type": "address", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 1443}, {"name": "balanceOf", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "address", "name": "_owner"}], "constant": true, "payable": false, "type": "function", "gas": 1645}, {"name": "transfer", "outputs": [{"type": "bool", "name": "out"}], "inputs": [{"type": "address", "name": "_to"}, {"type": "uint256", "name": "_value"}], "constant": false, "payable": false, "type": "function", "gas": 75034}, {"name": "transferFrom", "outputs": [{"type": "bool", "name": "out"}], "inputs": [{"type": "address", "name": "_from"}, {"type": "address", "name": "_to"}, {"type": "uint256", "name": "_value"}], "constant": false, "payable": false, "type": "function", "gas": 110907}, {"name": "approve", "outputs": [{"type": "bool", "name": "out"}], "inputs": [{"type": "address", "name": "_spender"}, {"type": "uint256", "name": "_value"}], "constant": false, "payable": false, "type": "function", "gas": 38769}, {"name": "allowance", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "address", "name": "_owner"}, {"type": "address", "name": "_spender"}], "constant": true, "payable": false, "type": "function", "gas": 1925}, {"name": "name", "outputs": [{"type": "bytes32", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 1623}, {"name": "symbol", "outputs": [{"type": "bytes32", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 1653}, {"name": "decimals", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 1683}, {"name": "totalSupply", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 1713}];
        this.originBlock = 6627944;
        this.providerFeePercent = 0.003;
        this.W = wallet;        
        this.markets = [
            {
                symbol: "DAI",
                exchangeAddress: "0x09cabEC1eAd1c0Ba254B09efb3EE13841712bE14",
                erc20Address: "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
            },
            {
                symbol: "MKR",
                exchangeAddress: "0x2C4Bd064b998838076fa341A83d007FC2FA50957",
                erc20Address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
            },
            {
                symbol: "SPANK",
                exchangeAddress: "0x4e395304655F0796bc3bc63709DB72173b9DdF98",
                erc20Address: "0x42d6622deCe394b54999Fbd73D108123806f6a18",
            },
            {
                symbol: "ZRX",
                exchangeAddress: "0xaE76c84C9262Cdb9abc0C2c8888e62Db8E22A0bF",
                erc20Address: "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
            },
            {
                symbol: "BAT",
                exchangeAddress: "0x2E642b8D59B45a1D8c5aEf716A84FF44ea665914",
                erc20Address: "0x0D8775F648430679A709E98d2b0Cb6250d2887EF",
            },
            {
                symbol: "LOOM",
                exchangeAddress: "0x417CB32bc991fBbDCaE230C7c4771CC0D69daA6b",
                erc20Address: "0xa4e8c3ec456107ea67d3075bf9e3df3a75823db0",
            },
            {
                symbol: "MKR",
                exchangeAddress: "0x2c4bd064b998838076fa341a83d007fc2fa50957",
                erc20Address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
            },
            {
                symbol: "ZRX",
                exchangeAddress: "0xae76c84c9262cdb9abc0c2c8888e62db8e22a0bf",
                erc20Address: "0xe41d2489571d322189246dafa5ebde1f4699f498",
            },
            {
                symbol: "BNB",
                exchangeAddress: "0x255e60c9d597dcaa66006a904ed36424f7b26286",
                erc20Address: "0xb8c77482e45f1f44de1745f52c74426c631bdd52",
            },
            {
                symbol: "GNO",
                exchangeAddress: "0xe8e45431b93215566ba923a7e611b7342ea954df",
                erc20Address: "0x6810e776880c02933d47db1b9fc05908e5386b96",
            },
            {
                symbol: "KNC",
                exchangeAddress: "0x49c4f9bc14884f6210f28342ced592a633801a8b",
                erc20Address: "0xdd974d5c2e2928dea5f71b9825b8b646686bd200",
            },
            {
                symbol: "LINK",
                exchangeAddress: "0xf173214c720f58e03e194085b1db28b50acdeead",
                erc20Address: "0x514910771af9ca656af840dff83e8264ecf986ca",
            },
            {
                symbol: "MANA",
                exchangeAddress: "0xc6581ce3a005e2801c1e0903281bbd318ec5b5c2",
                erc20Address: "0x0f5d2fb29fb7d3cfee444a200298f468908cc942",
            },
            {
                symbol: "REP",
                exchangeAddress: "0x48b04d2a05b6b604d8d5223fd1984f191ded51af",
                erc20Address: "0x1985365e9f78359a9b6ad760e32412f4a445e862",
            },
            {
                symbol: "SNT",
                exchangeAddress: "0x1aec8f11a7e78dc22477e91ed924fab46e3a88fd",
                erc20Address: "0x744d70fdbe2ba4cf95131626614a1763df805b9e",
            },
            {
                symbol: "HAY",
                exchangeAddress: "0x78bac62f2a4cd3a7cb7da2991affc7b11590f682",
                erc20Address: "0xfa3e941d1f6b7b10ed84a0c211bfa8aee907965e",
            },
            {
                symbol: "JCD",
                exchangeAddress: "0x657184e418d43a661a91d567182dc3d1a4179ec4",
                erc20Address: "0x0ed024d39d55e486573ee32e583bc37eb5a6271f",
            },
            {
                symbol: "BORIS",
                exchangeAddress: "0x4e0e28d426caf318747b8e05c8b0564a580e39a7",
                erc20Address: "0x919d0131fa5f77d99fbbbbace50bcb6e62332bf2",
            },
            {
                symbol: "GUSD",
                exchangeAddress: "0xd883264737ed969d2696ee4b4caf529c2fc2a141",
                erc20Address: "0x056fd409e1d7a124bd7017459dfea2f387b6d5cd",
            },
            {
                symbol: "SIM",
                exchangeAddress: "0x174dfb6e6e78c95678580b553eee7f282b28c795",
                erc20Address: "0x174dfb6e6e78c95678580b553eee7f282b28c795",
            },
            {
                symbol: "NEXO",
                exchangeAddress: "0x069c97dba948175d10af4b2414969e0b88d44669",
                erc20Address: "0xb62132e35a6c13ee1ee0f84dc5d40bad8d815206",
            },
            {
                symbol: "DNT",
                exchangeAddress: "0xaa3b3810c8aada6cbd2ce262699903ad7ae6a7ef",
                erc20Address: "0x0abdace70d3790235af448c88547603b945604ea",
            },
            {
                symbol: "BTU",
                exchangeAddress: "0xea3a62838477082d8f2106c43796d636dc78d8a4",
                erc20Address: "0xb683d83a532e2cb7dfa5275eed3698436371cc9f",
            },
            { symbol: 'ANT', exchangeAddress:'0x077d52B047735976dfdA76feF74d4d988AC25196', erc20Address: '0x960b236A07cf122663c4303350609A66A7B288C0'},
            { symbol: 'BAT', exchangeAddress:'0x2E642b8D59B45a1D8c5aEf716A84FF44ea665914', erc20Address: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF'},
            { symbol: 'BNT', exchangeAddress:'0x87d80DBD37E551F58680B4217b23aF6a752DA83F', erc20Address: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C'},
            { symbol: 'CVC', exchangeAddress:'0x1C6c712b1F4a7c263B1DBd8F97fb447c945d3b9a', erc20Address: '0x41e5560054824eA6B0732E656E3Ad64E20e94E45'},
            { symbol: 'DGX', exchangeAddress:'0xb92dE8B30584392Af27726D5ce04Ef3c4e5c9924', erc20Address: '0x4f3AfEC4E5a3F2A6a1A411DEF7D7dFe50eE057bF'},
            { symbol: 'FOAM', exchangeAddress:'0xf79cb3BEA83BD502737586A6E8B133c378FD1fF2', erc20Address: '0x4946Fcea7C692606e8908002e55A582af44AC121'},
            { symbol: 'FUN', exchangeAddress:'0x60a87cC7Fca7E53867facB79DA73181B1bB4238B', erc20Address: '0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b'},
            { symbol: 'GRID', exchangeAddress:'0x4B17685b330307C751B47f33890c8398dF4Fe407', erc20Address: '0x12B19D3e2ccc14Da04FAe33e63652ce469b3F2FD'},
            { symbol: 'KIN', exchangeAddress:'0xb7520a5F8c832c573d6BD0Df955fC5c9b72400F7', erc20Address: '0x818Fc6C2Ec5986bc6E2CBf00939d90556aB12ce5'},
            { symbol: 'PAX', exchangeAddress:'0xC040d51b07Aea5d94a89Bc21E8078B77366Fc6C7', erc20Address: '0x8E870D67F660D95d5be530380D0eC0bd388289E1'},
            { symbol: 'QCH', exchangeAddress:'0x755899F0540c3548b99E68C59AdB0f15d2695188', erc20Address: '0x687BfC3E73f6af55F0CccA8450114D107E781a0e'},
            { symbol: 'RDN', exchangeAddress:'0x7D03CeCb36820b4666F45E1b4cA2538724Db271C', erc20Address: '0x255Aa6DF07540Cb5d3d297f0D0D4D84cb52bc8e6'},
            { symbol: 'REN', exchangeAddress:'0x43892992B0b102459E895B88601Bb2C76736942c', erc20Address: '0x408e41876cCCDC0F92210600ef50372656052a38'},
            { symbol: 'RLC', exchangeAddress:'0xA825CAE02B310E9901b4776806CE25db520c8642', erc20Address: '0x607F4C5BB672230e8672085532f7e901544a7375'},
            { symbol: 'RHOC', exchangeAddress:'0x394e524b47A3AB3D3327f7fF6629dC378c1494a3', erc20Address: '0x168296bb09e24A88805CB9c33356536B980D3fC5'},
            { symbol: 'SALT', exchangeAddress:'0xC0C59cDe851bfcbdddD3377EC10ea54A18Efb937', erc20Address: '0x4156D3342D5c385a87D264F90653733592000581'},
            { symbol: 'SNX', exchangeAddress:'0x5d8888a212d033cff5f2e0ac24ad91a5495bad62', erc20Address: '0x3772f9716Cf6D7a09edE3587738AA2af5577483a'},  
            { symbol: 'SPANK', exchangeAddress:'0x4e395304655F0796bc3bc63709DB72173b9DdF98', erc20Address: '0x42d6622deCe394b54999Fbd73D108123806f6a18'},
            { symbol: 'SUSD', exchangeAddress:'0xa1ecdcca26150cf69090280ee2ee32347c238c7b', erc20Address: '0x0cbe2df57ca9191b64a7af3baa3f946fa7df2f25'}, 
            { symbol: 'TKN', exchangeAddress:'0xb6cFBf322db47D39331E306005DC7E5e6549942B', erc20Address: '0xaAAf91D9b90dF800Df4F55c205fd6989c977E73a'},
            { symbol: 'TUSD', exchangeAddress:'0x4F30E682D0541eAC91748bd38A648d759261b8f3', erc20Address: '0x8dd5fbCe2F6a956C3022bA3663759011Dd51e73E'},
            { symbol: 'USDC', exchangeAddress:'0x97deC872013f6B5fB443861090ad931542878126', erc20Address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'},
            { symbol: 'VERI', exchangeAddress:'0x17e5BF07D696eaf0d14caA4B44ff8A1E17B34de3', erc20Address: '0x8f3470A7388c05eE4e7AF3d01D8C722b0FF52374'},
            { symbol: 'WBTC', exchangeAddress:'0x4d2f5cFbA55AE412221182D8475bC85799A5644b', erc20Address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'},
            { symbol: 'WETH', exchangeAddress:'0xA2881A90Bf33F03E7a3f803765Cd2ED5c8928dFb', erc20Address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'},
            { symbol: 'XCHF', exchangeAddress:'0x8dE0d002DC83478f479dC31F76cB0a8aa7CcEa17', erc20Address: '0xB4272071eCAdd69d933AdcD19cA99fe80664fc08'},
            { symbol: 'ZIL', exchangeAddress:'0x7dc095A5CF7D6208CC680fA9866F80a53911041a', erc20Address: '0x05f4a42e251f2d52b8ed15E9FEdAacFcEF1FAD27'},
        ]

        this.portfolio = [];
    }

    findToken(erc20Address) {
        if( isUndefined(erc20Address) || erc20Address === '' ) throw new Error(`contractAddress: is undefined`);
        let idx = findIndex(this.portfolio, (o) => { 
            return o.erc20Address.toString().toLowerCase().trim() === erc20Address.toString().toLowerCase().trim(); 
        });
        if( idx < 0) {
            this.portfolio.push(
                {
                    erc20Address
                }
            );

            idx = findIndex(this.portfolio, (o) => { 
                if(!o.isNative){
                    return o.erc20Address.toString().toLowerCase().trim() === erc20Address.toString().toLowerCase().trim(); 
                }
            });
        }
        return idx;
    }

    async getTicker(input) {
        return fetch(`https://uniswap-analytics.appspot.com/api/v1/ticker?exchangeAddress=${input.exchangeAddress}`)
          .then(response => response.json())
          .then(async response => {
            console.log('response', response)
          });
    }

    async getExchangeRate(input, amount) {
        return new Promise( async (resolve, reject) => {
            try {
                console.clear()
                const inputValue = amount;
                const poolTokenDecimals = 18;
                
                const erc20Contract = new this.W.web3.eth.Contract(erc20Abi, input.contractAddress);
                const exchangeContract = new this.W.web3.eth.Contract(this.exchangeABI, input.exchangeAddress);
                let totalSupply = await exchangeContract.methods.totalSupply().call();
                totalSupply = BigNumber(totalSupply.toString())

                let ethReserve = await this.W.web3.eth.getBalance(input.exchangeAddress)
                ethReserve = BigNumber(ethReserve.toString());

                let erc20Balance = await erc20Contract.methods.balanceOf(input.exchangeAddress).call()
                erc20Balance = BigNumber(erc20Balance.toString())

                const exchangeRate = erc20Balance.multipliedBy(10 ** (18 - poolTokenDecimals)).dividedBy(ethReserve)

                const inputValueBN = BigNumber(inputValue);
                const outputValue = exchangeRate.multipliedBy(inputValueBN).toFixed(7)

                const outputValueBN = BigNumber(outputValue.toString())
                const X = parseFloat(outputValue * 1e18);
                

                const SLIPPAGE = 0.025
                const minOutput = outputValueBN.multipliedBy(1 - SLIPPAGE)
                const maxOutput = outputValueBN.multipliedBy(1 + SLIPPAGE)
                const liquidityMinted = inputValueBN.multipliedBy(totalSupply.dividedBy(ethReserve))
                const adjTotalSupply = totalSupply.dividedBy(10 ** poolTokenDecimals)

                let tokenValue = await erc20Contract.methods.balanceOf(input.exchangeAddress).call()
                    tokenValue = BigNumber(tokenValue.toString())
                let ethValue = await this.W.web3.eth.getBalance(input.exchangeAddress)
                    ethValue = BigNumber(ethValue.toString())

            
                const rate = tokenValue.multipliedBy(10 ** (18 - poolTokenDecimals)).dividedBy(ethValue)
                resolve(rate);

            } catch(e) {
                reject(e);
            }
          })
    }

    async getMarketData(item, fromBlock = this.originBlock) {
        console.log('fromBlock', fromBlock)
        if(!fromBlock) {
            fromBlock = this.originBlock
        }
        const erc20Contract = new this.W.web3.eth.Contract(erc20Abi, item.erc20Address);
        const exchangeContract = new this.W.web3.eth.Contract(this.exchangeABI, item.exchangeAddress);
        const tokenDecimals = Math.pow(10, 18);
        const exchangeAddress = item.exchangeAddress;
        var providerFeePercent = this.providerFeePercent;
  
        var myAddress = this.W.getAddress();
        var latestBlockObj = await this.W.web3.eth.getBlock('latest');
    
        var latestBlock = latestBlockObj["number"];
    
        // paginate through the logs to load all the events
        var events = [];
    
        var blockPageAmount = 1000;
    
        var toBlock = fromBlock + blockPageAmount;
    
        var options = {
            address: exchangeAddress    
        };
    
        while (true) {
            options["fromBlock"] = fromBlock;
            options["toBlock"] = toBlock;
        
            console.log("Retrieving data for exchange " + exchangeAddress + " from block " + fromBlock + " to " + toBlock);  
        
            var loadingUpToBlockNum = toBlock;

        
            try {
                await exchangeContract.getPastEvents("allEvents", options).then(responseEvents => {
                    responseEvents.forEach(event => {
                        events.push(event);
                    });
                });
            } catch (error) {
                console.log(error);

                //continue;
            };
        
            // if we've reached the end of the pages
            if (toBlock >= latestBlock) {
                break;
            }
        
            fromBlock = toBlock + 1;
            toBlock = fromBlock + blockPageAmount;
            toBlock = Math.min(toBlock, latestBlock);
        }
    
        let eventListTemp = [];
    
        let curEthTotal = 0;
        let curTokenTotal = 0;
    
        let curPoolShare = 0.0;
    
        let curPoolShareDisplay = 0.0;
    
        let numMyShareTokens = new BigNumber(0);
        let numMintedShareTokens = new BigNumber(0);
    
        let lastEventObj;

        let totalBuy = 0;
        let totalSell = 0;
        let totalVolume = 0;
    
        events.forEach(e => {
            let eventType = e.event;
        
            let eventObj = {
                type: eventType,
                curPoolShare: 0.0,
                numEth: 0,
                numTokens: 0,
                id: e.id,
                tx: e.transactionHash,
                provider: e.returnValues.provider,
                block: e.blockNumber,
                liquidtyProviderFee: "-",
                volume: 0 // how much swapping volume was in this event (set by purchase events only)
            };
        
            let eth, tokens;
        
            if (eventType === "AddLiquidity") {
                eth = e.returnValues[1] / 1e18;
                tokens = e.returnValues.token_amount / tokenDecimals;
                eventObj.type = "Add Liquidty";
            } else if (eventType === "RemoveLiquidity") {
                eth = -e.returnValues.eth_amount / 1e18;
                tokens = -e.returnValues.token_amount / tokenDecimals;
                eventObj.type = "Remove Liquidty";
            } else if (eventType === "TokenPurchase") {
                eth = e.returnValues.eth_sold / 1e18;
                tokens = -e.returnValues.tokens_bought / tokenDecimals;
                eventObj.provider = e.returnValues.buyer;
                eventObj.type = "Token Purchase";
                totalBuy++
                eventObj.volume = eth;
                totalVolume += eth;
                // calculate the eth fee that liquidity providers will receive
                eventObj.liquidtyProviderFee =
                (eth * providerFeePercent).toFixed(4) + " ETH";
            } else if (eventType === "EthPurchase") {
                eth = -e.returnValues.eth_bought / 1e18;
                tokens = e.returnValues.tokens_sold / tokenDecimals;
        
                eventObj.provider = e.returnValues.buyer;
                eventObj.type = "Eth Purchase";
                totalSell++;
        
                eventObj.volume = -eth;
                totalVolume += eventObj.volume;
        
                // calculate the token fee that liquidity providers will receive
                eventObj.liquidtyProviderFee =
                (tokens * providerFeePercent).toFixed(4) + " " + item.symbol;
            } else if (eventType === "Approval") {
                // ignore Approval events
                return;
            } else if (eventType === "Transfer") {
                // Track share tokens
                let sender = e.returnValues[0];
                let receiver = e.returnValues[1];
                let numShareTokens = new BigNumber(e.returnValues[2]); // / 1e18;
        
                // check if this was mint or burn share tokens
                if (receiver === "0x0000000000000000000000000000000000000000") {
                    // burn share tokens
                    numMintedShareTokens = numMintedShareTokens.minus(numShareTokens);
                } else if (sender === "0x0000000000000000000000000000000000000000") {
                    // mint share tokens
                    numMintedShareTokens = numMintedShareTokens.plus(numShareTokens);
                } else {
                    // this is a normal transfer, not a mint or burn
                    return;
                }
                return;
            }
    
            // save a reference to the last event object (transfer events follow add/remove liquidity)
            lastEventObj = eventObj;
        
            // update the total pool eth total
            curEthTotal += eth;
        
            // update the total pool token total
            curTokenTotal += tokens;
        
            // set the number of eth and tokens for this event
            eventObj.numEth = eth;
            eventObj.numTokens = tokens;
        
            // set the user's current pool share %
            eventObj.curPoolShare = curPoolShareDisplay;
        
            // push this event object onto the array
            eventListTemp.push(eventObj);
        });
    
        // reverse the list so the most recent events are first
        eventListTemp.reverse();

    
        let eventList = eventListTemp;
    
        const curEthPoolTotal = curEthTotal.toFixed(4);
        const curTokenPoolTotal = curTokenTotal.toFixed(4);
        let exchangeRate = this.getEthToTokenPrice(curEthTotal, curTokenTotal);

        return {
            ...item,
            totalVolume,
            totalSell,
            latestBlock,
            totalBuy,
            trades: (totalSell+totalBuy),
            exchangeRate,
            curEthPoolTotal,
            curTokenPoolTotal,
            eventList
        };
    }

    getEthToTokenPrice(ethReserve, tokenReserve) {
        var inputEthWithFee = 1 - this.providerFeePercent;
        var numerator = inputEthWithFee * tokenReserve;
        var denominator = ethReserve + inputEthWithFee;
      
        var rate = numerator / denominator;
        if (rate > 0) {
          return rate;
        } else {
          return 0;
        }
    }

    async getTokenState(item) {
        return new Promise( async (resolve, reject) => {
        const erc20Contract = new this.W.web3.eth.Contract(erc20Abi, item.erc20Address);
        const exchangeContract = new this.W.web3.eth.Contract(this.exchangeABI, item.exchangeAddress);
        // Get balance of liquidity tokens
        
        try {
            let share = await exchangeContract.methods.balanceOf(this.W.getAddress()).call();
            
                if (share.toString() !== '0'){
                    share = BigNumber(share.toString())
                    
                    const shareConverted = share.dividedBy(ConvertFromWei)
                    
                    // get total supply of liquidity tokens
                    let totalSupply = await exchangeContract.methods.totalSupply().call();
                    totalSupply = BigNumber(totalSupply.toString())

                    
                    // calculate fractional share of liquidity
                    const percentShare = share.dividedBy(totalSupply)

                    // Get ether balance of exchange
                    let etherBalance = await this.W.web3.eth.getBalance(item.exchangeAddress)
                    etherBalance = BigNumber(etherBalance.toString())

                    // get erc20 balance of exchange
                    let erc20Balance = await erc20Contract.methods.balanceOf(item.exchangeAddress).call()
                    erc20Balance = BigNumber(erc20Balance.toString())

                    let ethWithdrawValue = percentShare.multipliedBy(etherBalance)
                    ethWithdrawValue = BigNumber(Math.trunc(ethWithdrawValue.toNumber()))
                    ethWithdrawValue = ethWithdrawValue.dividedBy(ConvertFromWei)

                    let erc20WithdrawValueWei = percentShare.multipliedBy(erc20Balance)
                    erc20WithdrawValueWei = BigNumber(Math.trunc(erc20WithdrawValueWei.toNumber()))

                    let ethValueErc20 = await exchangeContract.methods.getTokenToEthInputPrice(erc20WithdrawValueWei).call()
                    ethValueErc20 = BigNumber(ethValueErc20.toString())
                    ethValueErc20 = ethValueErc20.dividedBy(ConvertFromWei)

                    const ethPrice = BigNumber( this.W.coinPrice );

                    const totalEth = ethValueErc20.plus(ethWithdrawValue)

                    const dollarValue = ethPrice.multipliedBy(totalEth)

                    //const srcAmount = parseFloat(this.W.web3.utils.fromWei(this.W.web3.utils.toBN(erc20WithdrawValueWei).toString() )).toFixed(2).toString();
                    const srcAmount = (erc20WithdrawValueWei.toNumber() / 1e18).toString();

                    const newEthWithValue = this.W.web3.utils.fromWei( (ethWithdrawValue.toNumber() * 1e18).toString(), 'ether' );
                    const liquidityTokens = this.W.web3.utils.fromWei( (shareConverted.toNumber() * 1e18).toString(), 'ether' );


                    const tokenInformation = {
                        value: dollarValue.toFixed(2),
                        symbol: item.symbol,
                        poolShare: {
                            eth: newEthWithValue.substring(0, 6), // ethWithdrawValue.toFixed(2).toString(),
                            token: srcAmount.substring(0, 6)
                        },
                        liquidityTokens: shareConverted.toFixed(5), // liquidityTokens.substring(0, 6),
                        ...item
                    }
                    const idx = this.findToken(item.erc20Address);
                    this.portfolio[idx] = tokenInformation;
                    resolve();
                }
            } catch(e) {console.log(e)}
            resolve();
        });
    }

    async getState() {
        const promises = this.markets.map( async t => {
            await this.getTokenState(t);
        })

        await Promise.all(promises)
    }
}

export default Uniswap;