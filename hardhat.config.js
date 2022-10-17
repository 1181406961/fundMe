require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-deploy");


/** @type string|string */
const GOERLI_RPC_URL =
    process.env.GOERLI_RPC_URL ||
    "https://eth-mainnet.alchemyapi.io/v2/your-api-key"
const PRIVATE_KEY =
    process.env.PRIVATE_KEY ||
    "0x11ee3108a03081fe260ecdc106554d09d9d1209bcafd46942b10e02943effc4a"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
        },
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,

        }
    },
    solidity: {
        compilers: [
            {
                version: "0.8.7"
            },
            {
                version: "0.6.6"
            }
        ]
    },
    etherscan: {
        apikey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enable: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
    },
    namedAccounts: {
        deployer: {
            default: 0,
            1: 0,
        }
    }
};
