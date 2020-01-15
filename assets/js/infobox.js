const { encodeAddress, decodeAddress } = require('@polkadot/keyring');
const pUtil = require('@polkadot/util');
const Web3 = require('web3');

const ClaimsArtifact = require('../contracts/Claims.json');
const FrozenTokenArtifact = require('../contracts/FrozenToken.json');

// const GOERLI_CLAIMS_ADDRESS = '0x46f8131Dd26E59F1f81299A8702B7cA3bD2B2535';
// const GOERLI_FROZENTOKEN_ADDRESS = '0xe4915b22A00f293ed49AeA9aD97738dE8BfB3949';

const CLAIMS_ADDRESS = '0xa2CBa0190290aF37b7e154AEdB06d16100Ff5907';
const FROZENTOKEN_ADDRESS = '0xb59f67A8BfF5d8Cd03f6AC17265c550Ed8F33907';

console.log('contracts instantiated');

const w3 = new Web3(new Web3.providers.WebsocketProvider("wss://mainnet.infura.io/ws/v3/d2e0f554436c4ec595954c34d9fecdb7"));
w3.eth.getBlockNumber().then((Res) => {
    console.log(Res);
});

const frozenToken = new w3.eth.Contract(FrozenTokenArtifact.abi, FROZENTOKEN_ADDRESS);
const claims = new w3.eth.Contract(ClaimsArtifact.abi, CLAIMS_ADDRESS);

document.getElementById('claims-address').innerHTML = CLAIMS_ADDRESS;
document.getElementById('contract-abi').innerHTML = JSON.stringify(ClaimsArtifact.abi);

const validAddress = async () => {
  let { value } = document.getElementById('validity-input');
  if (value.length !== 42) {
    document.getElementById('validity-statement').innerHTML = 'Not a valid Ethereum address.';
    return;
  }

  if (!frozenToken || !claims) {
    console.log('Contracts are not instatiated. There is likely a problem with the Node connection.');
    return;
  }

  let ethData = {
    original: value,
  };

  const amendedLogs = await claims.getPastEvents('Amended', {
    fromBlock: '9200000',
    toBlock: 'latest',
    filter: {
      // original: [ethData.original],
      amendedTo: [ethData.original],
    },
  });

  if (amendedLogs && amendedLogs.length && ethData.original !== '0x00b46c2526e227482e2EbB8f4C69E4674d262E75') {
    const [original, amendedTo] = amendedLogs[0].returnValues;
    ethData.original = original;
    ethData.amendedTo = amendedTo;
  }

  ethData.balance = await frozenToken.methods.balanceOf(ethData.original).call();
  if (ethData.amendedTo) {
    // Necessary to check for any balance of the amended to address too.
    ethData.balance = Number(ethData.balance) + (await frozenToken.methods.balanceOf(ethData.amendedTo).call());
  }


  if (Number(ethData.balance) === 0) {
    document.getElementById('validity-statement').innerHTML = "There is not a claim associated with this address. Did you use the right one?"
  } else {
    document.getElementById('validity-statement').innerHTML = "You have a claim! Please proceed with the next step! 👍";
  }
}

const check = async () => {
  let { value } = document.getElementById('address-input');
  if (value.length !== 42 && value.length !== 66 && value.length !== 48) {
    console.log('Wrong length input.');
    document.getElementById('eth-address').innerHTML = 'Unknown';
    document.getElementById('pd-address').innerHTML = 'None';
    document.getElementById('pubkey').innerHTML = 'None';
    document.getElementById('index').innerHTML = 'None';
    document.getElementById('balance').innerHTML = '0';
    document.getElementById('vesting').innerHTML = 'None';
    return;
  }

  if (!frozenToken || !claims) {
    console.log('Contracts are not instatiated. There is likely a problem with the Node connection.');
    return;
  }

  if (value.length === 48) {
    try {
      value = pUtil.u8aToHex(decodeAddress(value, 0));
    } catch (err) {
      console.log(err);
      console.log('error decoding polkadot address', value);
      return;
    }
  }

  const results = value.length === 42
    ? await getEthereumData(value, claims, frozenToken)
    : await getPolkadotData(value, claims, frozenToken);
  
  if (results.noBalance) {
    console.log("This account does not have balance. Are you sure you're using the right address?");
    return;
  } else {
    // console.log('results', results);
    document.getElementById('eth-address').innerHTML = results.original;
    document.getElementById('pd-address').innerHTML = results.pdAddress;
    document.getElementById('pubkey').innerHTML = results.pubkey;
    document.getElementById('index').innerHTML = results.index;
    document.getElementById('balance').innerHTML = results.balance;
    document.getElementById('vesting').innerHTML = results.vested ? results.vested + ' DOT' : 'None';
  }
}

// This takes the length 42 string.
const getEthereumData = async (ethAddress, claims, frozenToken) => {
  let ethData = {
    original: ethAddress,
    amendedTo: null,
    balance: null,
    vested: null,
    noBalance: false,
  };

  const amendedLogs = await claims.getPastEvents('Amended', {
    fromBlock: '9200000',
    toBlock: 'latest',
    filter: {
      // original: [ethData.original],
      amendedTo: [ethData.original],
    },
  });

  if (amendedLogs && amendedLogs.length && ethData.original !== '0x00b46c2526e227482e2EbB8f4C69E4674d262E75') {
    const { original, amendedTo } = amendedLogs[0].returnValues;
    ethData.original = original;
    ethData.amendedTo = amendedTo;
  }

  ethData.balance = await frozenToken.methods.balanceOf(ethData.original).call();
  if (ethData.amendedTo) {
    // Necessary to check for any balance of the amended to address too.
    ethData.balance = Number(ethData.balance) + (await frozenToken.methods.balanceOf(ethData.amendedTo).call());
  }

  // console.log('first', ethData);

  if (Number(ethData.balance) === 0) {
    return { noBalance: true, };
  }

  const vestedLogs = await claims.getPastEvents('Vested', {
    fromBlock: '9200000',
    toBlock: 'latest',
    filter: {
      eth: [ethData.original],
    }
  });
  // console.log('vested', vestedLogs);

  if (vestedLogs && vestedLogs.length) {
    ethData.vested = vestedLogs[0].returnValues.amount;
    // console.log('in vested', ethData.vested);
  }

  const vestedIncreasedLogs = await claims.getPastEvents('VestedIncreased', {
    fromBlock: '9200000',
    toBlock: 'latest',
    filter: {
      eth: [ethData.original],
    }
  });

  if (vestedIncreasedLogs && vestedIncreasedLogs.length) {
    // console.log('vestedIncreasedLogs', vestedIncreasedLogs);
    ethData.vested = vestedIncreasedLogs[vestedIncreasedLogs.length-1].returnValues.newTotal;
  }

  const claimData = await claims.methods.claims(ethData.original).call();
  // console.log(claimData);
  const { index, pubKey } = claimData;
  if (pubKey == '0x0000000000000000000000000000000000000000000000000000000000000000') {
    // console.log('in if', index, pubKey);
    ethData.index = 'None';
    ethData.pubkey = 'Not claimed';
    ethData.pdAddress = 'Not claimed';
  } else {
    // console.log('in else', pubkey, index)
    ethData.index = index;
    ethData.pubkey = pubKey;
    ethData.pdAddress = encodeAddress(pUtil.hexToU8a(pubKey), 0);
  }

  // Normalize balances
  ethData.balance = Number(ethData.balance) / 1000;
  if (ethData.vested) {
    ethData.vested = Number(ethData.vested) / 1000;
  }

  return ethData;
}

const getPolkadotData = async (pubkey, claims, frozenToken) => {
  const claimsForPubkey = await claims.methods.claimsForPubkey(pubkey, 0).call();
  return getEthereumData(claimsForPubkey, claims, frozenToken);
}

window.infoBoxChecker = check;
window.validAddress = validAddress;

// npx browserify infobox.js > infobox-browser.js; npx uglify-es --mangle --compress -- infobox-browser.js > infobox.min.js; rm infobox-browser.js