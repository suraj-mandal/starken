# NFT + NFT Marketplace Contracts

This project implements two core smart contracts on Starknet:

1. **NFT Contract (`IMyNFT`)**
2. **NFT Marketplace Contract (`INFTMarketplace`)**

Both contracts are written in Cairo and expose their functionality through well-defined interfaces.

---

## 📦 NFT Contract (`IMyNFT`)

### Core Function
- **`create_nft(ref self)`**
  - Mints a new NFT to the caller (`get_caller_address()`).
  - Typically assigns a new `token_id` and records ownership.

This contract implements the basic ERC721-like behavior needed for creating and holding NFTs.

---

## 🏪 NFT Marketplace Contract (`INFTMarketplace`)

The marketplace allows users to list, buy, and manage NFTs using STRK token as the medium of exchange.

### Core Functions

- **`list_item(ref self, nft_address, token_id, price)`**
  - Lists an NFT for sale.
  - Requires that the caller owns the NFT and has approved the marketplace contract to transfer it.
  - `nft_address`: The address of the NFT contract.
  - `token_id`: The NFT identifier.
  - `price`: Listing price (denominated in STRK or configured ERC20).

- **`get_listing(self, nft_address, token_id) -> Listing`**
  - Fetches details of an existing listing, including seller and price.

- **`update_listing(ref self, nft_address, token_id, new_price)`**
  - Updates the price of an active listing.
  - Can only be called by the seller.

- **`cancel_listing(ref self, nft_address, token_id)`**
  - Cancels an active listing.
  - Returns the NFT to the seller.

- **`buy_item(ref self, nft_address, token_id, data)`**
  - Purchases a listed NFT.
  - Transfers payment from buyer → seller.
  - Transfers NFT from seller → buyer.
  - `data`: Optional extra calldata for advanced use cases.

- **`get_proceeds(self, seller_address) -> u256`**
  - Returns the total proceeds accrued by a seller from completed sales.

- **`withdraw_proceeds(ref self)`**
  - Allows a seller to withdraw their proceeds balance to their account.

---

## 🔑 Typical Flow

1. **Seller creates NFT**
   - Calls `IMyNFT.create_nft()`

2. **Seller lists NFT**
   - Approves marketplace to transfer NFT.
   - Calls `INFTMarketplace.list_item(nft_address, token_id, price)`.

3. **Buyer purchases NFT**
   - Calls `INFTMarketplace.buy_item(nft_address, token_id, data)`.
   - STRK transferred to seller.
   - NFT transferred to buyer.

4. **Seller withdraws proceeds**
   - Calls `INFTMarketplace.withdraw_proceeds()` to move balance to their wallet.

---

## 🛠️ Notes
- Marketplace enforces listing ownership and approvals.
- All payments are denominated in STRK.
- Reentrancy guards should be applied to `buy_item` and `withdraw_proceeds`.

---

## 📖 Interfaces

### NFT
```rust
#[starknet::interface]
pub trait IMyNFT<TContractState> {
    fn create_nft(ref self: TContractState);
}
```

### NFT Marketplace
```rust
#[starknet::interface]
pub trait INFTMarketplace<TContractState> {
    fn list_item(
        ref self: TContractState, nft_address: ContractAddress, token_id: u256, price: u256,
    );
    fn get_listing(self: @TContractState, nft_address: ContractAddress, token_id: u256) -> Listing;
    fn update_listing(
        ref self: TContractState, nft_address: ContractAddress, token_id: u256, new_price: u256,
    );
    fn cancel_listing(ref self: TContractState, nft_address: ContractAddress, token_id: u256);
    fn buy_item(
        ref self: TContractState, nft_address: ContractAddress, token_id: u256, data: Span<felt252>,
    );
    fn get_proceeds(self: @TContractState, seller_address: ContractAddress) -> u256;
    fn withdraw_proceeds(ref self: TContractState);
}
