use contracts::nft::{IMyNFTDispatcher, IMyNFTDispatcherTrait};
use openzeppelin_token::erc721::ERC721Component::{Event as ERC721Event, Transfer};
use snforge_std::{
    ContractClassTrait, DeclareResultTrait, Event, EventSpyAssertionsTrait, declare, spy_events,
    start_cheat_caller_address,
};
use starknet::ContractAddress;

fn deploy_contract(name: ByteArray) -> ContractAddress {
    let contract = declare(name).unwrap().contract_class();
    // Manually serialize ByteArray for the constructor
    // https://www.starknet.io/cairo-book/ch102-04-serialization-of-cairo-types.html
    let constructor_data = array![
        0, 0x4d794e4654, 5, // 'MyNFT'
        0, 0x4e4654, 3, // 'NFT'
        0,
        0x68747470733a2f2f6170692e6578616d706c652e636f6d2f76312f,
        27 // 'https://api.example.com/v1/'
    ];
    let (contract_address, _) = contract.deploy(@constructor_data).unwrap();
    contract_address
}

#[test]
fn test_create_nft() {
    let contract_address = deploy_contract("MyNFT");
    let dispatcher = IMyNFTDispatcher { contract_address };

    let mut spy = spy_events();

    let caller: ContractAddress = 123.try_into().unwrap();

    start_cheat_caller_address(contract_address, caller);

    dispatcher.create_nft();

    let event: Event = ERC721Event::Transfer(
        Transfer { from: 0.try_into().unwrap(), to: caller, token_id: 1 },
    )
        .into();

    let expected_event: Array<(ContractAddress, Event)> = array![(contract_address, event)];

    spy.assert_emitted(@expected_event);
}
