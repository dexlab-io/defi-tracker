'use strict';
const pools = [
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
];
module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

   return queryInterface.bulkInsert('UniPools', pools, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('UniPools', null, {});
  }
};
