use starknet::ContractAddress;

#[starknet::interface]
pub trait INFTMarketplace<TContractState> {
    fn list_item(
        ref self: TContractState, nft_address: ContractAddress, token_id: u256, price: u256,
    );
    fn cancel_listing(ref self: TContractState, nft_address: ContractAddress, token_id: u256);
    fn buy_item(ref self: TContractState, token_id: u256);
}

#[starknet::contract]
pub mod NFTMarketplace {
    use openzeppelin_security::ReentrancyGuardComponent;
    use openzeppelin_token::erc721::interface::{IERC721Dispatcher, IERC721DispatcherTrait};
    use starknet::storage::{
        Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess,
    };
    use starknet::{ContractAddress, get_caller_address, get_contract_address};

    component!(
        path: ReentrancyGuardComponent, storage: reentrancy_guard, event: ReentrancyGuardEvent,
    );

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
    }

    #[derive(Drop, Serde, starknet::Store)]
    struct Listing {
        pub price: u256,
        pub seller: ContractAddress,
    }

    #[storage]
    struct Storage {
        s_listings: Map<ContractAddress, Map<u256, Listing>>,
        s_proceeds: Map<ContractAddress, u256>,
        #[substorage(v0)]
        reentrancy_guard: ReentrancyGuardComponent::Storage,
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

            self._store_listing(seller, nft_address, token_id, price);

            self.emit(ItemListed { seller, nft_address, token_id, price });
        }

        fn cancel_listing(ref self: ContractState, nft_address: ContractAddress, token_id: u256) {
            let seller = get_caller_address();
            self._is_owner(nft_address, token_id, seller);
            self._is_listed(nft_address, token_id);

            self._store_listing(0.try_into().unwrap(), nft_address, token_id, 0);

            self.emit(ItemCanceled { seller, nft_address, token_id });
        }

        fn buy_item(ref self: ContractState, token_id: u256) {
            self.reentrancy_guard.start();
            // TODO: Revisit when it's clear how to process BTC payments

            self.reentrancy_guard.end();
        }
    }

    #[generate_trait]
    pub impl InternalImpl of InternalTrait {
        fn _not_listed(ref self: ContractState, nft_address: ContractAddress, token_id: u256) {
            let listing = self._get_listing(nft_address, token_id);
            assert(listing.price <= 0, Errors::ALREADY_LISTED);
        }

        fn _is_listed(ref self: ContractState, nft_address: ContractAddress, token_id: u256) {
            let listing = self._get_listing(nft_address, token_id);
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

        fn _store_listing(
            ref self: ContractState,
            seller: ContractAddress,
            nft_address: ContractAddress,
            token_id: u256,
            price: u256,
        ) {
            self.s_listings.entry(nft_address).entry(token_id).write(Listing { price, seller });
        }

        fn _get_listing(
            ref self: ContractState, nft_address: ContractAddress, token_id: u256,
        ) -> Listing {
            self.s_listings.entry(nft_address).entry(token_id).read()
        }
    }
}

