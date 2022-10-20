const {deployments, ethers, getNamedAccounts} = require("hardhat");
const {assert} = require("chai");
describe("FunMe", async () => {
    let fundMe;
    let deployer;
    let mockV3Aggregator;
    beforeEach(async () => {
        // 部署contract，并使用fixture将其变为snapshot方便复用
        await deployments.fixture(["all"])
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator",deployer);
    })
    describe("constructor", async () => {
        it("sets the aggregator addresses correctly", async () => {
            const response = await fundMe.getPriceFeed();
            assert.equal(response,mockV3Aggregator.address);
        })
    })
})