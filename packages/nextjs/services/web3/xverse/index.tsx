import {
  ConnectArgs,
  ConnectorNotConnectedError,
  ConnectorNotFoundError,
  InjectedConnector,
  InjectedConnectorOptions,
  UserRejectedRequestError,
} from "@starknet-react/core";
import { ConnectorData } from "@starknet-react/core/src/connectors/base";
import { getXverseFromWindowSync } from "./getXverseFromWindow";
import { xverseWalletIcon, xverseWalletId, xverseWalletName } from "./consts";

interface XverseProvider {
  request: <Method extends string>(
    method: Method,
    params?: any,
  ) => Promise<any>;
  on?: (event: string, handler: (...args: any[]) => void) => void;
  removeListener?: (event: string, handler: (...args: any[]) => void) => void;
}

interface XverseAddress {
  address: string;
  publicKey: string;
  purpose: string;
  addressType: string;
}

export class XverseConnector extends InjectedConnector {
  private __wallet?: XverseProvider;
  private __options: InjectedConnectorOptions;
  private __account?: string;
  private __addresses?: XverseAddress[];

  constructor() {
    const options: InjectedConnectorOptions = {
      id: xverseWalletId,
      name: xverseWalletName,
      icon: xverseWalletIcon,
    };
    super({
      options,
    });
    this.__options = options;
  }

  get id() {
    return this.__options.id;
  }

  get name() {
    return xverseWalletName;
  }

  get icon() {
    return xverseWalletIcon;
  }

  available() {
    return !!getXverseFromWindowSync();
  }

  async chainId(): Promise<bigint> {
    // Bitcoin doesn't have chainId in the same way as Starknet
    // Return a placeholder for Bitcoin mainnet
    return BigInt(0);
  }

  async ready(): Promise<boolean> {
    this._ensureWallet();

    if (!this.__wallet) return false;

    // Check if wallet has already been connected
    return !!this.__account;
  }

  async connect(_args: ConnectArgs = {}): Promise<ConnectorData> {
    this._ensureWallet();

    if (!this.__wallet) {
      throw new ConnectorNotFoundError();
    }

    try {
      // Request Bitcoin addresses using sats-connect protocol
      const response = await this.__wallet.request("getAddresses", {
        purposes: ["payment"], // For receiving payments
        message: "Connect to Starken Marketplace",
      });

      if (!response || response.status === "error") {
        throw new UserRejectedRequestError();
      }

      const addresses = response.result?.addresses || [];

      if (addresses.length === 0) {
        throw new UserRejectedRequestError();
      }

      this.__addresses = addresses;
      // Use the payment address as the main account
      const paymentAddress = addresses.find(
        (addr: XverseAddress) => addr.purpose === "payment",
      );

      if (!paymentAddress) {
        throw new Error("No payment address found");
      }

      this.__account = paymentAddress.address;

      // Setup event listeners
      if (this.__wallet.on) {
        this.__wallet.on("accountsChanged", this._handleAccountsChanged);
        this.__wallet.on("disconnect", this._handleDisconnect);
      }

      const chainId = await this.chainId();
      this.emit("connect", { account: this.__account, chainId });

      return {
        account: this.__account,
        chainId,
      };
    } catch (error) {
      console.error("Xverse connection error:", error);
      throw new UserRejectedRequestError();
    }
  }

  async disconnect(): Promise<void> {
    this._ensureWallet();

    if (!this.__wallet) {
      throw new ConnectorNotFoundError();
    }

    // Clean up listeners
    if (this.__wallet.removeListener) {
      this.__wallet.removeListener(
        "accountsChanged",
        this._handleAccountsChanged,
      );
      this.__wallet.removeListener("disconnect", this._handleDisconnect);
    }

    this.__account = undefined;
    this.__addresses = undefined;
    this.emit("disconnect");
  }

  async request<T>(call: any): Promise<T> {
    this._ensureWallet();

    if (!this.__wallet) {
      throw new ConnectorNotConnectedError();
    }

    return this.__wallet.request(call.type, call.params);
  }

  private _ensureWallet() {
    this.__wallet = getXverseFromWindowSync();
  }

  private _handleAccountsChanged = (accounts?: string[]) => {
    if (!accounts || accounts.length === 0) {
      this.emit("disconnect");
    } else {
      this.__account = accounts[0];
      const chainId = BigInt(0);
      this.emit("change", { account: this.__account, chainId });
    }
  };

  private _handleDisconnect = () => {
    this.emit("disconnect");
  };

  // Helper method to get connected addresses
  getAddresses() {
    return this.__addresses;
  }

  // Helper method to sign Bitcoin transactions
  async signTransaction(psbtBase64: string, broadcast = false) {
    this._ensureWallet();

    if (!this.__wallet) {
      throw new ConnectorNotConnectedError();
    }

    const response = await this.__wallet.request("signPsbt", {
      psbt: psbtBase64,
      broadcast,
    });

    if (response.status === "error") {
      throw new Error(response.error?.message || "Failed to sign transaction");
    }

    return response.result;
  }

  // Helper method for sending BTC
  async sendBitcoin(recipients: Array<{ address: string; amount: number }>) {
    this._ensureWallet();

    if (!this.__wallet) {
      throw new ConnectorNotConnectedError();
    }

    const response = await this.__wallet.request("sendTransfer", {
      recipients,
    });

    if (response.status === "error") {
      throw new Error(response.error?.message || "Failed to send BTC");
    }

    return response.result;
  }
}
