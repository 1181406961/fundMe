// import
// main function
// call of main function
const {network} = require("hardhat");
const {developmentChains, networkConfig} = require("../helper-hardhat-config");
const {verify} = require("../utils/verify")
module.exports.default = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId
    let ethUsdPriceFeedAddress;
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }
    log("----------------------------------------------------")
    log("Deploying FundMe and waiting for confirmations...")
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
    })
    log(`FundMe deployed at ${fundMe.address}`);
    if (developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(fundMe.address, [ethUsdPriceFeedAddress]);
    }
};