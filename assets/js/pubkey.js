const { encodeAddress, decodeAddress } = require('@polkadot/keyring');
const pUtil = require('@polkadot/util');
const bs58 = require('bs58');

const check = (address) => {
    const decoded = pUtil.bufferToU8a(bs58.decode(address));

    return decoded[0] === 0;
}

const getPubkey = () => {
    const { value } = document.getElementById('dot-addr-inp');
    let pubkey;
    try {
        pubkey = pUtil.u8aToHex(decodeAddress(value));
        if (check(value)) {
        } else {
            const right = encodeAddress(pUtil.hexToU8a(pubkey), 0);
            document.getElementById('not-pd-addr').innerHTML = `WARNING: This is not a Polkadot encoded address. Polkadot encoded addresses start with 1. Your Polkadot address will be ${right}.`;
        }
        document.getElementById('decoded-pubkey').innerHTML = pubkey;
    } catch (err) {
        pubkey = 'invalid';
    }
}

window.getPubkey = getPubkey;

// npx browserify pubkey.js > pubkey-browser.js; npx uglify-es --mangle --compress -- pubkey-browser.js > pubkey.min.js; rm pubkey-browser.js