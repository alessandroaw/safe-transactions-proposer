import SafeApiKit from "@safe-global/api-kit";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import { MetaTransactionData } from "@safe-global/safe-core-sdk-types";
import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

const chainId = 42161n;
const SAFE_ADDRESS = process.env.SAFE_ADDRESS as string;
const SUBMITTER_PK = process.env.SAFE_SUBMITTER_PRIVATE_KEY as string;

if (!SAFE_ADDRESS) {
  throw new Error("SAFE_ADDRESS is not set");
}

if (!SUBMITTER_PK) {
  throw new Error("SAFE_SUBMITTER_PRIVATE_KEY is not set");
}

const rpcUrl = "https://arb1.arbitrum.io/rpc";
const provider = new ethers.JsonRpcProvider(rpcUrl);
const wallet = new ethers.Wallet(SUBMITTER_PK, provider);
const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: wallet });

const safeService = new SafeApiKit({ chainId });
// const safeFactory = await SafeFactory.create({ ethAdapter });

async function main() {
  const safeSdk = await Safe.create({ ethAdapter, safeAddress: SAFE_ADDRESS });

  const txList: MetaTransactionData[] = [
    {
      to: "0x6dD963C510c2D2f09d5eDdB48Ede45FeD063Eb36",
      data: "0x095ea7b300000000000000000000000070d1f8ebe79f5b7c6acff2811c5d3a422404e9870000000000000000000000000000000000000000000000000000000000000001",
      value: "0",
    },
  ];

  console.log("transaction list created");

  const safeTransaction = await safeSdk.createTransaction({
    transactions: txList,
  });

  const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
  const senderSignature = await safeSdk.signHash(safeTxHash);
  await safeService.proposeTransaction({
    safeAddress: SAFE_ADDRESS,
    safeTransactionData: safeTransaction.data,
    safeTxHash,
    senderAddress: wallet.address,
    senderSignature: senderSignature.data,
  });
  console.log("transaction proposed");
}

main();
