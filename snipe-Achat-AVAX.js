const ethers = require('ethers');
const prompt = require('prompt-sync')({sigint: true});
const secret = require('./secret')
//npm install ethers
//npm install prompt-sync
//node snipe.js

// CHOSES A CHANGER
const privateKey = secret["private_key"]// clé privée de ton wallet
const myAddress = secret["public_key"] // clé publique de ton wallet

const amountToSwap = '0.2' // En avax
const gwei = '80'
const slippage = 0    // 0 = on s'en fout du slippage juste donne moi mes shitcoins
// FIN CHOSES A CHANGERA



const addresses = {
AVAX: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",   
router: "0x60aE616a2155Ee3d9A68541Ba4544862310933d4", // Traderjoe
target:  myAddress                                    
}
const AVAXAmount = ethers.utils.parseEther(amountToSwap).toHexString();
const gasPrice = ethers.utils.parseUnits(gwei, 'gwei');
const gas = {
  gasPrice: gasPrice,
  gasLimit: 2000000
}

const AVAXprovider = new ethers.providers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc");
const account = new ethers.Wallet(privateKey, AVAXprovider); 
const router = new ethers.Contract( 
  addresses.router,
  [
    'function swapExactAVAXForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint256[] memory amounts)'
  ],
  account
);
console.log
  
  const snipe = async (token) => {
 
  const tx = await router.swapExactAVAXForTokens(
    slippage, 
    [addresses.AVAX, token],
    addresses.target,
    Math.floor(Date.now() / 1000) + 60 * 20, 
    {
        ...gas,
        value: AVAXAmount
    }
  );
  console.log(`Hop Hop on achète `);
  const receipt = await tx.wait();
  //console.log(`Transaction hash: ${receipt.transactionHash}`);
}

const token = prompt('Le token que tu veux acheter chef :');

(async () => {
  await snipe(token);
})();