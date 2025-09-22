use starknet::ContractAddress;

#[derive(Drop, Serde, starknet::Store, PartialEq)]
pub struct Listing {
    pub price: u256,
    pub seller: ContractAddress,
}

#[starknet::interface]
pub trait IListings<TState> {
    fn get_listing(self: @TState, nft_address: ContractAddress, token_id: u256) -> Listing;
    fn store_listing(
        ref self: TState,
        seller: ContractAddress,
        nft_address: ContractAddress,
        token_id: u256,
        price: u256,
    );
    fn remove_listing(ref self: TState, nft_address: ContractAddress, token_id: u256);
}

#[starknet::component]
pub mod ListingsComponent {
    use starknet::ContractAddress;
    use starknet::storage::{
        Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess,
    };
    use super::{IListings, Listing};

    #[storage]
    pub struct Storage {
        listings: Map<ContractAddress, Map<u256, Listing>>,
    }

    #[embeddable_as(ListingsImpl)]
    impl Listings<
        TContractState, +HasComponent<TContractState>,
    > of IListings<ComponentState<TContractState>> {
        fn get_listing(
            self: @ComponentState<TContractState>, nft_address: ContractAddress, token_id: u256,
        ) -> Listing {
            self.listings.entry(nft_address).entry(token_id).read()
        }

        fn store_listing(
            ref self: ComponentState<TContractState>,
            seller: ContractAddress,
            nft_address: ContractAddress,
            token_id: u256,
            price: u256,
        ) {
            self.listings.entry(nft_address).entry(token_id).write(Listing { price, seller });
        }

        fn remove_listing(
            ref self: ComponentState<TContractState>, nft_address: ContractAddress, token_id: u256,
        ) {
            self
                .listings
                .entry(nft_address)
                .entry(token_id)
                .write(Listing { price: 0, seller: 0.try_into().unwrap() });
        }
    }
}
