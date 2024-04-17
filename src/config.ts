import dotenv from "dotenv";
dotenv.config();

export type Config = {
  safeAddress: string;
  proposerPK: string;
};

export function getConfig(): Config {
  const safeAddress = process.env.SAFE_ADDRESS;
  const proposerPK = process.env.SAFE_PROPOSER_PRIVATE_KEY;

  if (!safeAddress) {
    throw new Error("SAFE_ADDRESS is not set");
  }

  if (!proposerPK) {
    throw new Error("SAFE_PROPOSER_PRIVATE_KEY is not set");
  }

  return {
    safeAddress,
    proposerPK,
  };
}
