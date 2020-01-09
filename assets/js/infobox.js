const { encodeAddress, decodeAddress } = require('@polkadot/keyring');
const pUtil = require('@polkadot/util');
const Web3 = require('web3');

const ClaimsArtifact = require('../contracts/Claims.json');
const FrozenTokenArtifact = require('../contracts/FrozenToken.json');

const GOERLI_CLAIMS_ADDRESS = '0x46f8131Dd26E59F1f81299A8702B7cA3bD2B2535';
const GOERLI_FROZENTOKEN_ADDRESS = '0xe4915b22A00f293ed49AeA9aD97738dE8BfB3949';

console.log('hello world');

const w3 = new Web3(new Web3.providers.HttpProvider("https://goerli.prylabs.net"));
w3.eth.getBlockNumber().then((Res) => {
    console.log(Res);
});

const frozenToken = new w3.eth.Contract(FrozenTokenArtifact.abi, GOERLI_FROZENTOKEN_ADDRESS);
const claims = new w3.eth.Contract(ClaimsArtifact.abi, GOERLI_CLAIMS_ADDRESS);

const check = async () => {
  const { value } = document.getElementById('address-input');
  if (value.length !== 42 && value.length !== 66) {
    return;
  }

  const results = await balanceCheck(value);
  const { balData } = results;
  document.getElementById('pd-address').innerHTML = balData.polkadotAddress || 'None';
  document.getElementById('pubkey').innerHTML = balData.pubKey || 'None';
  document.getElementById('index').innerHTML = balData.index || '0';
  document.getElementById('balance').innerHTML = balData.bal || '0';
  document.getElementById('vesting').innerHTML = balData.vested ? balData.vested + ' DOT' : 'None';

}

const balanceCheck = async (value) => {
  let amended = false;
  let polkadotAddress, pubKey, index, bal, vestingAmt;

  if (value.length !== 42 && value.length !== 66) {
    return;
  }

  if (!frozenToken || !claims) {
    return;
  }

  if (value.length === 42) {
    const logs = await claims.getPastEvents('Amended', {
      fromBlock: '0',
      toBlock: 'latest',
      filter: {
        amendedTo: [value],
      }
    });

    if (logs && logs.length && value !== '0x00b46c2526e227482e2EbB8f4C69E4674d262E75') {
      value = logs[0].returnValues.original;
      amended = logs[0].returnValues.original;
    }

    const vested = await claims.getPastEvents('Vested', {
      fromBlock: '0',
      toBlock: 'latest',
      filter: {
        eth: [value],
      }
    });

    if (vested && vested.length) {
      vestingAmt = vested[0].returnValues.amount;
    }
  }

  // Check whether it is a Ethereum or Polkadot address
  try {
    if (value.length === 42) {
      bal = await frozenToken.methods.balanceOf(value).call();
    } else {
      bal = await claims.methods.saleAmounts(value).call();
    }

    if (Number(bal) === 0) {
      this.setState({
        noBalance: true,
      });
      return;
    };

  } catch (error) {
    console.log('error occur in checking balance:', error)
  }

  if (value.length === 42) {
    const claimData = await claims.methods.claims(value).call();
      index = claimData.index;
      pubKey = claimData.pubKey;
    if (pubKey !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
      polkadotAddress = encodeAddress(pUtil.hexToU8a(pubKey), 0);
    }
  } else {
    pubKey = value
    polkadotAddress = encodeAddress(value, 0);                      
  }

  // Normalization
  bal = Number(bal) / 1000;
  if (vestingAmt) {
    vestingAmt = Number(vestingAmt) / 1000;
  }

  return {
    amended,
    balData: {
      bal,
      index: index || null,
      pubKey: pubKey || null,
      vested: vestingAmt,
    },
    noBalance: false,
  }
}

globalThis.check = check;

// npx browserify infobox.js > infobox-browser.js; npx uglify-es --mangle --compress -- infobox-browser.js > infobox.min.js; rm infobox-browser.js