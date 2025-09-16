use openzeppelin_token::erc721::interface::IERC721Dispatcher;
use snforge_std_deprecated::{ContractClassTrait, DeclareResultTrait, declare};
use starknet::ContractAddress;

fn deploy_contract(name: ByteArray) -> ContractAddress {
    let contract = declare(name).unwrap().contract_class();
    // Manually serialize ByteArray for the constructor
    // https://www.starknet.io/cairo-book/ch102-04-serialization-of-cairo-types.html
    let constructor_data = array![
        // 'MyNFT'
        0,
        0x4d794e4654,
        5,
        // 'NFT',
        0,
        0x4e4654,
        3,
        // 'https://api.example.com/v1/'
        0,
        0x68747470733a2f2f6170692e6578616d706c652e636f6d2f76312f,
        27,
    ];
    let (contract_address, _) = contract.deploy(@constructor_data).unwrap();
    contract_address
}

#[test]
fn test_create_nft() {
    let contract_address = deploy_contract("MyNFT");
    let _dispatcher = IERC721Dispatcher { contract_address };
}
