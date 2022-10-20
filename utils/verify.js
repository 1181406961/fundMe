const {run} = require("hardhat");

async function verify(contractAddress, args) {
    console.log("Verifying contract...");
    try {
        // 执行脚本命令
        await run("verify:verify", {
            // 命令行参数
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!");
        } else {
            console.log(e);
        }
    }
}

module.exports = {verify}