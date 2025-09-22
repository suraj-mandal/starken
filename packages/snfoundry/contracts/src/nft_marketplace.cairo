use starknet::ContractAddress;
use crate::components::listings::Listing;

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

#[starknet::contract]
pub mod NFTMarketplace {
    use contracts::components::proceeds::{IProceeds, ProceedsComponent};
    use openzeppelin_security::ReentrancyGuardComponent;
    use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use openzeppelin_token::erc721::interface::{IERC721Dispatcher, IERC721DispatcherTrait};
    use starknet::event::EventEmitter;
    use starknet::storage::Map;
    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    use crate::components::listings::{IListings, ListingsComponent};
    use super::Listing;

    component!(path: ProceedsComponent, storage: proceeds, event: ProceedsEvent);
    component!(path: ListingsComponent, storage: listings, event: ListingsEvent);
    component!(
        path: ReentrancyGuardComponent, storage: reentrancy_guard, event: ReentrancyGuardEvent,
    );

    pub const FELT_STRK_CONTRACT: felt252 =
        0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d;

    impl ReentrancyInternalImpl = ReentrancyGuardComponent::InternalImpl<ContractState>;

    pub mod Errors {
        pub const PRICE_NOT_MET: felt252 = 'Marketplace: price not met';
        pub const ITEM_NOT_FOR_SALE: felt252 = 'Marketplace: item not for sale';
        pub const NOT_LISTED: felt252 = 'Marketplace: item not listed';
        pub const ALREADY_LISTED: felt252 = 'Marketplace: already listed';
        pub const NO_PROCEEDS: felt252 = 'Marketplace: no proceeds';
        pub const NOT_OWNER: felt252 = 'Marketplace: not owner';
        pub const NOT_APPROVED_FOR_MARKETPLACE: felt252 = 'Marketplace: not approved';
        pub const PRICE_MUST_BE_ABOVE_ZERO: felt252 = 'Marketplace: price not > zero';
    }

    #[derive(Drop, starknet::Event)]
    pub struct ItemListed {
        #[key]
        pub seller: ContractAddress,
        #[key]
        pub nft_address: ContractAddress,
        #[key]
        pub token_id: u256,
        pub price: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct ItemCanceled {
        #[key]
        pub seller: ContractAddress,
        #[key]
        pub nft_address: ContractAddress,
        #[key]
        pub token_id: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct ItemBought {
        #[key]
        pub buyer: ContractAddress,
        #[key]
        pub nft_address: ContractAddress,
        #[key]
        pub token_id: u256,
        pub price: u256,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        ItemListed: ItemListed,
        ItemCanceled: ItemCanceled,
        ItemBought: ItemBought,
        #[flat]
        ReentrancyGuardEvent: ReentrancyGuardComponent::Event,
        ProceedsEvent: ProceedsComponent::Event,
        ListingsEvent: ListingsComponent::Event,
    }

    #[storage]
    struct Storage {
        s_listings: Map<ContractAddress, Map<u256, Listing>>,
        #[substorage(v0)]
        pub proceeds: ProceedsComponent::Storage,
        #[substorage(v0)]
        reentrancy_guard: ReentrancyGuardComponent::Storage,
        #[substorage(v0)]
        pub listings: ListingsComponent::Storage,
    }

    #[abi(embed_v0)]
    impl NFTMarketplaceImpl of super::INFTMarketplace<ContractState> {
        fn list_item(
            ref self: ContractState, nft_address: ContractAddress, token_id: u256, price: u256,
        ) {
            let seller = get_caller_address();
            self._not_listed(nft_address, token_id);
            self._is_owner(nft_address, token_id, seller);

            assert(price > 0, Errors::PRICE_MUST_BE_ABOVE_ZERO);

            let nft = IERC721Dispatcher { contract_address: nft_address };
            let approved = nft.get_approved(token_id);
            assert(approved == get_contract_address(), Errors::NOT_APPROVED_FOR_MARKETPLACE);

            self.listings.store_listing(seller, nft_address, token_id, price);

            self.emit(ItemListed { seller, nft_address, token_id, price });
        }

        fn get_listing(
            self: @ContractState, nft_address: ContractAddress, token_id: u256,
        ) -> Listing {
            self.listings.get_listing(nft_address, token_id)
        }

        fn update_listing(
            ref self: ContractState, nft_address: ContractAddress, token_id: u256, new_price: u256,
        ) {
            let seller = get_caller_address();
            self._not_listed(nft_address, token_id);
            self._is_owner(nft_address, token_id, seller);

            assert(new_price > 0, Errors::PRICE_MUST_BE_ABOVE_ZERO);

            self.listings.store_listing(seller, nft_address, token_id, new_price);

            self.emit(ItemListed { seller, nft_address, token_id, price: new_price });
        }

        fn cancel_listing(ref self: ContractState, nft_address: ContractAddress, token_id: u256) {
            let seller = get_caller_address();
            self._is_owner(nft_address, token_id, seller);
            self._is_listed(nft_address, token_id);

            self.listings.store_listing(0.try_into().unwrap(), nft_address, token_id, 0);

            self.emit(ItemCanceled { seller, nft_address, token_id });
        }

        fn buy_item(
            ref self: ContractState,
            nft_address: ContractAddress,
            token_id: u256,
            data: Span<felt252>,
        ) {
            self.reentrancy_guard.start();
            self._is_listed(nft_address, token_id);

            let buyer = get_caller_address();
            let strk_contract_address = FELT_STRK_CONTRACT.try_into().unwrap();
            let strk_dispatcher = IERC20Dispatcher { contract_address: strk_contract_address };
            let user_balance = strk_dispatcher.balance_of(buyer);
            let listed_item = self.listings.get_listing(nft_address, token_id);

            assert(user_balance >= listed_item.price, Errors::PRICE_NOT_MET);

            strk_dispatcher.transfer_from(buyer, get_contract_address(), listed_item.price);

            self.proceeds.increment_balance(listed_item.seller, listed_item.price);

            self.listings.remove_listing(nft_address, token_id);

            let nft_dispatcher = IERC721Dispatcher { contract_address: nft_address };
            nft_dispatcher.safe_transfer_from(listed_item.seller, buyer, token_id, data);

            self.emit(ItemBought { buyer, nft_address, token_id, price: listed_item.price });

            self.reentrancy_guard.end();
        }

        fn get_proceeds(self: @ContractState, seller_address: ContractAddress) -> u256 {
            self.proceeds.get_seller_balance(seller_address)
        }

        fn withdraw_proceeds(ref self: ContractState) {
            self.reentrancy_guard.start();

            let seller = get_caller_address();
            let proceeds = self.proceeds.get_seller_balance(seller);
            assert(proceeds > 0, Errors::NO_PROCEEDS);

            self.proceeds.clear_seller_balance(seller);

            let strk_contract_address = FELT_STRK_CONTRACT.try_into().unwrap();
            let strk_dispatcher = IERC20Dispatcher { contract_address: strk_contract_address };
            strk_dispatcher.transfer(seller, proceeds);

            self.reentrancy_guard.end();
        }
    }

    #[generate_trait]
    pub impl InternalImpl of InternalTrait {
        fn _not_listed(ref self: ContractState, nft_address: ContractAddress, token_id: u256) {
            let listing = self.listings.get_listing(nft_address, token_id);
            assert(listing.price <= 0, Errors::ALREADY_LISTED);
        }

        fn _is_listed(ref self: ContractState, nft_address: ContractAddress, token_id: u256) {
            let listing = self.listings.get_listing(nft_address, token_id);
            assert(listing.price > 0, Errors::NOT_LISTED);
        }

        fn _is_owner(
            ref self: ContractState,
            nft_address: ContractAddress,
            token_id: u256,
            spender: ContractAddress,
        ) {
            let nft = IERC721Dispatcher { contract_address: nft_address };
            let owner = nft.owner_of(token_id);
            assert(spender == owner, Errors::NOT_OWNER);
        }
    }
}

