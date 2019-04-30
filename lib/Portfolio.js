import { store } from '../stateManagement/store';
import { UPDATE_PORTFOLIO } from '../stateManagement/actionTypes';

export default class Portfolio {
  static FLAG_ENCRYPTED = 'data_encrypted';

  constructor(wallets = [], favoriteCurrency = 'USD') {
    /** {Array.<Wallet>} */
    this.wallets = wallets;
    this.favoriteCurrency = favoriteCurrency;
  }

  addWallet(wallet) {
    // check if exists already
    this.wallets.push(wallet);
  }

  save() {
    store.dispatch({
      type: UPDATE_PORTFOLIO,
      portfolio: {
        wallets: this.wallets,
        favoriteCurrency: this.favoriteCurrency
      },
    });
  }

  /**
   * Lookup wallet in list by it's secret and
   * remove it from `this.wallets`
   *
   * @param wallet {AbstractWallet}
   */
  deleteWallet(wallet) {
    const secret = wallet.getSecret();
    const tempWallets = [];
    for (const value of this.wallets) {
      if (value.getSecret() === secret) {
        // the one we should delete
        // nop
      } else {
        // the one we must keep
        tempWallets.push(value);
      }
    }
    this.wallets = tempWallets;
  }

  /**
   * For each wallet, fetches balance from remote endpoint.
   * Use getter for a specific wallet to get actual balance.
   * Returns void.
   * If index is present then fetch only from this specific wallet
   *
   * @return {Promise.<void>}
   */
  async fetchWalletBalances(index) {
    if (index || index === 0) {
      let c = 0;
      for (const wallet of this.wallets) {
        if (c++ === index) {
          await wallet.fetchBalance();
        }
      }
    } else {
      for (const wallet of this.wallets) {
        await wallet.fetchBalance();
      }
    }
  }

  /**
   * Fetches from remote endpoint all transactions for each wallet.
   * Returns void.
   * To access transactions - get them from each respective wallet.
   * If index is present then fetch only from this specific wallet.
   *
   * @param index {Integer} Index of the wallet in this.wallets array,
   *                        blank to fetch from all wallets
   * @return {Promise.<void>}
   */
  async fetchWalletTransactions(index) {
    if (index || index === 0) {
      let c = 0;
      for (const wallet of this.wallets) {
        if (c++ === index) {
          await wallet.fetchTransactions();
        }
      }
    } else {
      for (const wallet of this.wallets) {
        await wallet.fetchTransactions();
      }
    }
  }

  /**
   *
   * @returns {Array.<AbstractWallet>}
   */
  getWallets() {
    return this.wallets;
  }

  /**
   * Getter for all transactions in all wallets.
   * But if index is provided - only for wallet with corresponding index
   *
   * @param index {Integer} Wallet index in this.wallets. Empty for all wallets.
   * @return {Array}
   */
  getTransactions(index) {
    if (index || index === 0) {
      let txs = [];
      let c = 0;
      for (const wallet of this.wallets) {
        if (c++ === index) {
          txs = txs.concat(wallet.getTransactions());
        }
      }
      return txs;
    }

    let txs = [];
    for (const wallet of this.wallets) {
      txs = txs.concat(wallet.getTransactions());
    }
    return txs;
  }

  /**
   * Getter for a sum of all balances of all wallets
   *
   * @return {number}
   */
  getBalance() {
    let finalBalance = 0;
    for (const wal of this.wallets) {
      finalBalance += wal.balance;
    }
    return finalBalance;
  }
}
