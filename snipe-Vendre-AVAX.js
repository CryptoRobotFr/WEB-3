const ethers = require('ethers');
const prompt = require('prompt-sync')({sigint: true});
const { Contract } = require('ethers');
const secret = require('./secret')
// Installer ethers et prompt (npm install)
// Executer node snipe.js


const AVAXprovider = new ethers.providers.JsonRpcProvider('https://api.avax.network/ext/bc/C/rpc');

const privateKey = secret["private_key"]// clé privée de ton wallet
const myAddress = secret["public_key"] // clé publique de ton wallet

abii = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
]

const gwei = '80'     
const slippage = 0   


const gasPrice = ethers.utils.parseUnits(gwei, 'gwei');
const gas = {
  gasPrice: gasPrice,
  gasLimit: 1200000
}


const options = {
    address: myAddress,
    provider: AVAXprovider, 
  }

const getBalance = async (options,tokenAddress) => {
    const contract = new Contract(tokenAddress, abii, options.provider);
    const balance = await contract.balanceOf(options.address);
    b = balance._hex
    return b;
  };

const addresses = {
    AVAX: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",   
    router: "0x60aE616a2155Ee3d9A68541Ba4544862310933d4", //router traderjoe tu connais
    target:  myAddress                                    
}

const account = new ethers.Wallet(privateKey, AVAXprovider); 
const router = new ethers.Contract( 
  addresses.router,
  [
    'function swapExactTokensForAVAX(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
  ],
  account
);
console.log

const snipe = async (token) => {
    AVAXAmount = await getBalance(options, token)
    const tx = await router.swapExactTokensForAVAX(
    AVAXAmount,
    slippage, 
    [token,addresses.AVAX],
    addresses.target,
    Math.floor(Date.now() / 1000) + 60 * 20, 
    {
        ...gas,
    }
  );

  console.log(`HOP HOP on vend`);
  const receipt = await tx.wait();
  //console.log(`Transaction hash: ${receipt.transactionHash}`);
}

const token = prompt('le token que tu veux vendre chef : ');

(async () => {
  await snipe(token);
})();