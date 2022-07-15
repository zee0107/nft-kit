require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const newRoyaltyAddress = "0xb8726031fb7Ba9b3d8D348EaE9dd2d334b94711c"; // modify as needed

  const MyNFT = await hre.ethers.getContractFactory("MyNFT");

  const nft = await MyNFT.attach(
    process.env.CONTRACT_ADDRESS // deployed contract address
  );
  console.log("MyNFT attached to:", nft.address);

  console.log(`Setting new royalty receiver address...`);

  const res = await nft.setRoyaltyReceiverAddress(newRoyaltyAddress);

  console.log("Royalty receiver address set!", res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
