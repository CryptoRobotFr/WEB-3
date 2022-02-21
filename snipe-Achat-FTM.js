const ethers = require('ethers');
const prompt = require('prompt-sync')({sigint: true});
const secret = require('./secret')
// installer node.js
//npm install ethers
//npm install prompt-sync
//node snipe.js

// CHOSES A CHANGER
const privateKey = secret["private_key"]// clé privée de ton wallet
const myAddress = secret["public_key"] // clé publique de ton wallet

const amountToSwap = '1'
const gwei = '220'     //check les frais mais c'est dans environ 190
const slippage = 0    // 0 = on s'en fout du slippage juste donne moi mes tokens
// FIN CHOSES A CHANGER






const addresses = {
FTM: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83", //WFTM
router: "0xf491e7b69e4244ad4002bc14e878a34207e38c29", // Spookyswap
target:  myAddress                                    
}

const FTMAmount = ethers.utils.parseEther(amountToSwap).toHexString();
const gasPrice = ethers.utils.parseUnits(gwei, 'gwei');
const gas = {
  gasPrice: gasPrice,
  gasLimit: 2000000
}

const FTMprovider = new ethers.providers.JsonRpcProvider('https://rpcapi.fantom.network');
const account = new ethers.Wallet(privateKey, FTMprovider); 

const router = new ethers.Contract( 
  addresses.router,
  [
    'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)'
  ],
  account
);
  
  const snipe = async (token) => {
 
  const tx = await router.swapExactETHForTokens(
    slippage, 
    [addresses.FTM, token],
    addresses.target,
    Math.floor(Date.now() / 1000) + 60 * 20, 
    {
        ...gas,
        value: FTMAmount
    }
  );
  console.log(`hop hop on achete la betise`);
  const receipt = await tx.wait();
  //console.log(`Transaction hash: ${receipt.transactionHash}`);
}

const token = prompt('le token que tu veux acheter chef : ');

(async () => {
  await snipe(token);
})();