#[starknet::contract]
mod NFTMarketplace {
    use starknet::ContractAddress;
    use starknet::storage::{Map, StoragePathEntry, StoragePointerReadAccess};

    pub mod Errors {
        pub const PRICE_NOT_MET: felt252 = 'Marketplace: price not met';
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
    }

    #[derive(Drop, Serde, starknet::Store)]
    struct Listing {
        price: u256,
        seller: ContractAddress,
    }

    #[storage]
    struct Storage {
        s_listings: Map<ContractAddress, Map<u256, Listing>>,
        s_proceeds: Map<ContractAddress, u256>,
    }

    #[generate_trait]
    pub impl InternalImpl of InternalTrait {
        fn _not_listed(ref self: ContractState, nft_address: ContractAddress, token_id: u256) {
            let listing = self.s_listings.entry(nft_address).entry(token_id).read();
            assert(listing.price > 0, Errors::PRICE_NOT_MET);
        }
    }
}

