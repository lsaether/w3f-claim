const { encodeAddress, decodeAddress } = require('@polkadot/keyring');
const pUtil = require('@polkadot/util');
const bs58 = require('bs58');

const check = (address) => {
    const decoded = pUtil.bufferToU8a(bs58.decode(address));
    // console.log(decoded);

    return decoded[0] === 0;
}

const getPubkey = () => {
    const { value } = document.getElementById('dot-addr-inp');
    // console.log(value);
    // console.log(check(value));
    let pubkey;
    try {
        pubkey = pUtil.u8aToHex(decodeAddress(value));
        if (check(value)) {
        } else {
            alert(`Alert: Your address is not Polkadot encoded! But we still got the valid public key ${pubkey}`);
        }
        document.getElementById('decoded-pubkey').innerHTML = pubkey;
    } catch (err) {
        // console.log(err);
        pubkey = 'invalid';
    }
    // console.log(pubkey);
}

globalThis.getPubkey = getPubkey;

// npx browserify pubkey.js > pubkey-browser.js; npx uglify-es --mangle --compress -- pubkey-browser.js > pubkey.min.js; rm pubkey-browser.js