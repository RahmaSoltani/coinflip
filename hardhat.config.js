
// hardhat.config.js
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

task("balance", "Prints the balance of an account")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs) => {
    const balance = await ethers.provider.getBalance(taskArgs.account);
    console.log(ethers.utils.formatEther(balance), "ETH");
  });
module.exports = {
  solidity: {
    version: "0.8.19", // Update to the version specified in your contract
  },
  networks: {
    rinkeby: {

      url: "https://ethereum-sepolia.core.chainstack.com/80a2be45f9a0f6619f3b4a19c1d06c7a",
      accounts: ["0x206ee6930dbb7bf730a13b84cd2953c46fc555885d249a94a7c9068c1896d935"]

    }
  }
};
