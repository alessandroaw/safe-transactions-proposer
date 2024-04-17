import { MetaTransactionData } from "@safe-global/safe-core-sdk-types";
import { SafeProposer } from "../src";

async function main() {
  const safeProposer = new SafeProposer({
    chainId: 42161n,
    rpcUrl: "https://arb1.arbitrum.io/rpc",
  });

  const txList: MetaTransactionData[] = [
    {
      to: "0x6dD963C510c2D2f09d5eDdB48Ede45FeD063Eb36",
      data: "0x095ea7b300000000000000000000000070d1f8ebe79f5b7c6acff2811c5d3a422404e9870000000000000000000000000000000000000000000000000000000000000001",
      value: "0",
    },
  ];

  console.log("Proposing transactions...");
  await safeProposer.proposeTransactions(txList);
  console.log("Transactions proposed!");
}

main();
