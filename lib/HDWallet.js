import HDKEY from 'ethereumjs-wallet/hdkey';
import bip39 from 'bip39';

export default class HDWallet {
    /**
     * Accepts Valid bip32 passphrase
     * @param  {} secret=''
     */
    constructor(secret = null) {
        this.type = 'GenericHDWallet';
        this.defaultHDpath = "m/44'/60'/0'/0/0";
        this.secret = secret;

        /**
         * Should we have a pending array?
         */
      
        if( secret ) {
            this.import();
        }
    }

    import() {
        // TODO
        /**
         * we need to indenty if's a mnemonic or private key
         * if( this.secret.length === 12 )
         */
        this.importFromMasterSeed();
    }

    importFromMasterSeed() {
        const seed = bip39.mnemonicToSeed(this.secret);
        this._hd = HDKEY.fromMasterSeed(seed);
        this.instanceWallet = this._hd.derivePath(this.defaultHDpath).getWallet();
    }

    // TODO tests
    importFromExtendedKey() {
        this._hd = HDKEY.fromExtendedKey(seed);
        this.instanceWallet = this._hd.derivePath(this.defaultHDpath).getWallet();
    }

    static validateMnemonic( mnemonic ) {
        return bip39.validateMnemonic(mnemonic)
    }

    /**
     * BIP32 Extended private key
     * Info: m
     * https://bip32jp.github.io/english/
     */
    getPrivateExtendedKey() {
        return this._hd.privateExtendedKey();
    }

    /**
     * BIP32 Extended public key
     * Info: m
     * https://bip32jp.github.io/english/
     */
    getPublicExtendedKey() {
        return this._hd.publicExtendedKey();
    }

    /**
     * BIP32 Derived Extended private key from this.defaultHDpath
     */
    getDerivedPrivateExtendedKey() {
        return this._hd.derivePath(this.defaultHDpath).privateExtendedKey();
    }

    /**
     * BIP32 Derived Extended public key from this.defaultHDpath
     */
    getDerivedPublicExtendedKey() {
        return this._hd.derivePath(this.defaultHDpath).publicExtendedKey();
    }

    /**
     * Private Key of the instance wallet
     */
    getPrivateKey() {
        return this.instanceWallet.getPrivateKey().toString('hex');
    }

    /**
     * return ethUtil.bufferToHex(this.getPrivateKey())
     */
    getPrivateKeyString() {
        return this.instanceWallet.getPrivateKeyString();
    }

    /**
     * return ethUtil.bufferToHex(this.getPrivateKey())
     */
    getPublicKeyString() {
        if(this.watchOnly) return this.address;
        return this.instanceWallet.getPublicKeyString();
    }

    getAddress() {
        return this.instanceWallet.getAddressString();
    }
}