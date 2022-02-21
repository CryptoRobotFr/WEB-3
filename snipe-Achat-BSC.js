const ethers = require('ethers');
const prompt = require('prompt-sync')({sigint: true});
const secret = require('./secret')
// installer node.js
//npm install ethers
//npm install prompt-sync
//node snipe.js

// CHOSES A CHANGER
const privateKey = secret["private_key"]// clé privée de ton walletE
const myAddress = secret["public_key"] // clé publique de ton wallet

const amountToSwap = '0.01'
const gwei = '12'     // 20 c'est beaucoup, 10 c'est devant tout le monde en marché classique, 5 c'est le minimum
const slippage = 0    // 0 = on s'en fout du slippage juste donne moi mes tokens
// FIN CHOSES A CHANGER






const addresses = {
WBNB: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",   // Must have BNB
router: "0x10ed43c718714eb63d5aa57b78b54704e256024e", // Router pancakeswap
target:  myAddress                                    
}

const BNBAmount = ethers.utils.parseEther(amountToSwap).toHexString();
const gasPrice = ethers.utils.parseUnits(gwei, 'gwei');
const gas = {
  gasPrice: gasPrice,
  gasLimit: 2000000
}

const BSCprovider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
const account = new ethers.Wallet(privateKey, BSCprovider); 

const router = new ethers.Contract( 
  addresses.router,
  [
    'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)'
  ],
  account
);
  
  const snipe = async (token) => {
 
  const tx = await router.swapExactETHForTokens(
    slippage, // Degen ape don't give a fuxk about slippage
    [addresses.WBNB, token],
    addresses.target,
    Math.floor(Date.now() / 1000) + 60 * 20, // 10 minutes from now
    {
        ...gas,
        value: BNBAmount
    }
  );
  console.log(`Swapping BNB for tokens...`);
  const receipt = await tx.wait();
  console.log(`Transaction hash: ${receipt.transactionHash}`);
}

const token = prompt('Input token address:');

(async () => {
  await snipe(token);
})();
