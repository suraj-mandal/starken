use starknet::ContractAddress;

#[starknet::interface]
pub trait IProceeds<TState> {
    fn seller_balance(self: @TState, seller_address: ContractAddress) -> u256;
    fn increment(ref self: TState, seller_address: ContractAddress, amount: u256);
}

#[starknet::component]
pub mod ProceedsComponent {
    use starknet::ContractAddress;
    use starknet::storage::{
        Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess,
    };
    use super::IProceeds;

    #[storage]
    pub struct Storage {
        // Mapping of user address to amount sold
        proceeds: Map<ContractAddress, u256>,
    }

    #[embeddable_as(ProceedsImpl)]
    impl Proceeds<
        TContractState, +HasComponent<TContractState>,
    > of IProceeds<ComponentState<TContractState>> {
        fn seller_balance(
            self: @ComponentState<TContractState>, seller_address: ContractAddress,
        ) -> u256 {
            self.proceeds.entry(seller_address).read()
        }

        fn increment(
            ref self: ComponentState<TContractState>, seller_address: ContractAddress, amount: u256,
        ) {
            let balance = self.seller_balance(seller_address);
            let new_balance = balance + amount;
            self.proceeds.entry(seller_address).write(new_balance);
        }
    }
}
