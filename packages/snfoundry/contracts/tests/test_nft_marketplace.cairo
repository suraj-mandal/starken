use snforge_std::interact_with_state;
use NFTMarketplace::{ItemCanceled, ItemListed};
use contracts::nft::{IMyNFTDispatcher, IMyNFTDispatcherTrait};
use contracts::nft_marketplace::{
    INFTMarketplaceDispatcher, INFTMarketplaceDispatcherTrait, NFTMarketplace,
};
use openzeppelin_token::erc721::interface::{IERC721Dispatcher, IERC721DispatcherTrait};
use snforge_std::{
    ContractClassTrait, DeclareResultTrait, EventSpyAssertionsTrait, declare, spy_events,
    start_cheat_caller_address,
};
use starknet::ContractAddress;
use crate::test_nft::deploy_nft_contract;
use NFTMarketplace::InternalTrait;

fn deploy_marketplace_contract(name: ByteArray) -> ContractAddress {
    let contract = declare(name).unwrap().contract_class();
    let (contract_address, _) = contract.deploy(@array![]).unwrap();
    contract_address
}

#[test]
fn test_list_nft_item() {
    let nft_address = deploy_nft_contract("MyNFT");
    let marketplace_address = deploy_marketplace_contract("NFTMarketplace");

    let caller: ContractAddress = 123.try_into().unwrap();
    start_cheat_caller_address(nft_address, caller);
    start_cheat_caller_address(marketplace_address, caller);

    let nft = IMyNFTDispatcher { contract_address: nft_address };
    nft.create_nft();

    let erc721 = IERC721Dispatcher { contract_address: nft_address };
    erc721.approve(marketplace_address, 1);

    let mut spy = spy_events();

    let marketplace = INFTMarketplaceDispatcher { contract_address: marketplace_address };
    marketplace.list_item(nft_address, 1, 200);

    spy
        .assert_emitted(
            @array![
                (
                    marketplace_address,
                    NFTMarketplace::Event::ItemListed(
                        ItemListed { seller: caller, nft_address, token_id: 1, price: 200 },
                    ),
                ),
            ],
        );
}

#[test]
fn test_list_nft_item_state() {
        let nft_address = deploy_nft_contract("MyNFT");
    let marketplace_address = deploy_marketplace_contract("NFTMarketplace");

    let caller: ContractAddress = 123.try_into().unwrap();
    start_cheat_caller_address(nft_address, caller);
    start_cheat_caller_address(marketplace_address, caller);

    let nft = IMyNFTDispatcher { contract_address: nft_address };
    nft.create_nft();

    let token_id = 1;
    let erc721 = IERC721Dispatcher { contract_address: nft_address };
    erc721.approve(marketplace_address, token_id);

    interact_with_state(
        marketplace_address,
        || {
            let mut state = NFTMarketplace::contract_state_for_testing();

            let listing = state._get_listing(nft_address, token_id);

            assert(listing.price == 0, 'price should be zero');
            assert(listing.seller == 0.try_into().unwrap(), 'seller should be zero');
        }
    );

    let marketplace = INFTMarketplaceDispatcher { contract_address: marketplace_address };
    marketplace.list_item(nft_address, token_id, 200);

    interact_with_state(
        marketplace_address,
        || {
            let mut state = NFTMarketplace::contract_state_for_testing();

            let listing = state._get_listing(nft_address, token_id);

            assert(listing.price == 200, 'price should be 200');
            assert(listing.seller == 123.try_into().unwrap(), 'seller should be 123');
        }
    );
}

#[test]
fn test_cancel_listing() {
    let nft_address = deploy_nft_contract("MyNFT");
    let marketplace_address = deploy_marketplace_contract("NFTMarketplace");

    let caller: ContractAddress = 123.try_into().unwrap();
    start_cheat_caller_address(nft_address, caller);
    start_cheat_caller_address(marketplace_address, caller);

    let nft = IMyNFTDispatcher { contract_address: nft_address };
    nft.create_nft();

    let token_id = 1;
    let erc721 = IERC721Dispatcher { contract_address: nft_address };
    erc721.approve(marketplace_address, token_id);

    let marketplace = INFTMarketplaceDispatcher { contract_address: marketplace_address };
    marketplace.list_item(nft_address, token_id, 200);

    let mut spy = spy_events();

    marketplace.cancel_listing(nft_address, token_id);

    spy
        .assert_emitted(
            @array![
                (
                    marketplace_address,
                    NFTMarketplace::Event::ItemCanceled(
                        ItemCanceled { seller: caller, nft_address, token_id },
                    ),
                ),
            ],
        );
}
