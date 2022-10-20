const {deployments, ethers, getNamedAccounts} = require("hardhat");
const {assert, expect} = require("chai");
describe("FunMe", () => {
    let fundMe;
    let deployer;
    let mockV3Aggregator;
    const sendValue = ethers.utils.parseEther("1");
    beforeEach(async () => {
        // 部署contract，并使用fixture将其变为snapshot方便复用
        await deployments.fixture(["all"])
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
    })
    // 测试constructor
    describe("constructor", () => {
        it("sets the aggregator addresses correctly", async () => {
            const response = await fundMe.getPriceFeed();
            assert.equal(response, mockV3Aggregator.address);
        })
    })
    // 测试fund
    describe("fund", () => {
        it("Fails if you don't send enough ETH", async () => {
            await expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!");
        })
        it("Update the amount funded data structure", async () => {
            const transactionResponse = await fundMe.fund({value: sendValue});
            await transactionResponse.wait(1);
            const response = await fundMe.getAddressToAmountFunded(deployer);
            assert.equal(response.toString(), sendValue.toString())
        })
    })
    // 测试withdraw
    describe("withdraw", () => {
        beforeEach(async () => {
            await fundMe.fund({value: sendValue});
        })
        it("withdraws ETH from a single funder", async () => {
            // 获取fundMe初始金额和deployer的初始金额
            const fundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const startingDeployerBalance = await fundMe.provider.getBalance(deployer);
            const transactionResponse = await fundMe.withdraw();
            const {gasUsed, effectiveGasPrice} = await transactionResponse.wait();
            const gasCost = gasUsed.mul(effectiveGasPrice);
            const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer);
            assert.equal(endingFundMeBalance, 0);
            // deployer账号余额 += 捐赠的钱-转账gas花费
            assert.equal(fundMeBalance.sub(gasCost).add(startingDeployerBalance).toString(),
                endingDeployerBalance.toString())
        })
        it("is allows us to withdraw with multiple funders", async () => {
            const accounts = await ethers.getSigners();
            console.log(accounts)
            for (i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(accounts[i]);
                await  fundMeConnectedContract.fund({value:sendValue});
            }
            const allPeopleFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const startingDeployerBalance = await fundMe.provider.getBalance(deployer);

            const transactionResponse = await fundMe.cheaperWithdraw();
            const transactionReceipt = await transactionResponse.wait();
            const { gasUsed, effectiveGasPrice } = transactionReceipt;
            const withdrawGasCost = gasUsed.mul(effectiveGasPrice);

            const endingDeployerBalance = await fundMe.provider.getBalance(deployer);
            // deployer账号余额 += 所有人捐赠的钱-转账gas花费
            assert.equal(allPeopleFundMeBalance.sub(withdrawGasCost).add(startingDeployerBalance).toString(),
                endingDeployerBalance.toString()
            )
        })
    })
})