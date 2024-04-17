import SafeApiKit from "@safe-global/api-kit";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import { MetaTransactionData } from "@safe-global/safe-core-sdk-types";
import { ethers } from "ethers";
import { getConfig } from "./config";

export type SafeProposeSetup = {
  chainId: bigint;
  rpcUrl: string;
};

export class SafeProposer {
  private _wallet: ethers.Wallet;
  private _safeSdk: Safe;
  private _safeService: SafeApiKit;
  private _isSetupCompleted = false;
  private _safeAddress: string;

  constructor({ chainId, rpcUrl }: SafeProposeSetup) {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const { proposerPK, safeAddress } = getConfig();

    this._safeAddress = safeAddress;
    this._wallet = new ethers.Wallet(proposerPK, provider);
    this._safeService = new SafeApiKit({ chainId });
  }

  public async addDelegate(delegateeAddress: string) {
    await this._ensureInitialized();
    const res = await this._safeService.addSafeDelegate({
      safeAddress: this._safeAddress,
      delegatorAddress: this._wallet.address,
      delegateAddress: delegateeAddress,
      label: "tx submitter",
      signer: this._wallet,
    });

    console.log(res);
  }

  public async getDelegate() {
    await this._ensureInitialized();
    return await this._safeService.getSafeDelegates({
      safeAddress: this._safeAddress,
    });
  }

  public async proposeTransactions(txList: MetaTransactionData[]) {
    await this._ensureInitialized();
    const safeTransaction = await this._safeSdk.createTransaction({
      transactions: txList,
    });

    const safeTxHash = await this._safeSdk.getTransactionHash(safeTransaction);
    const senderSignature = await this._safeSdk.signHash(safeTxHash);
    await this._safeService.proposeTransaction({
      safeAddress: this._safeAddress,
      safeTransactionData: safeTransaction.data,
      safeTxHash,
      senderAddress: this._wallet.address,
      senderSignature: senderSignature.data,
    });

    return safeTxHash;
  }

  private async _initializeSafeSdk() {
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: this._wallet,
    });

    this._safeSdk = await Safe.create({
      ethAdapter,
      safeAddress: this._safeAddress,
    });

    this._isSetupCompleted = true;
  }

  private async _ensureInitialized() {
    if (!this._isSetupCompleted) {
      await this._initializeSafeSdk();
    }
  }
}
