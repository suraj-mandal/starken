use NFTMarketplace::{FELT_STRK_CONTRACT, ItemBought, ItemCanceled, ItemListed};
use contracts::components::listings::{IListings, Listing};
use contracts::nft::{IMyNFTDispatcher, IMyNFTDispatcherTrait};
use contracts::nft_marketplace::{
    INFTMarketplaceDispatcher, INFTMarketplaceDispatcherTrait, NFTMarketplace,
};
use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
use openzeppelin_token::erc721::interface::{IERC721Dispatcher, IERC721DispatcherTrait};
use snforge_std::{
    CheatSpan, ContractClassTrait, DeclareResultTrait, EventSpyAssertionsTrait,
    cheat_caller_address, declare, interact_with_state, spy_events,
    start_cheat_account_contract_address, start_cheat_caller_address, stop_cheat_caller_address,
};
use starknet::ContractAddress;
use crate::test_nft::deploy_nft_contract;

fn deploy_marketplace_contract(name: ByteArray) -> ContractAddress {
    let contract = declare(name).unwrap().contract_class();
    let (contract_address, _) = contract.deploy(@array![]).unwrap();
    contract_address
}

const TOKEN_OWNER: felt252 = 0x064b48806902a367c8598f4f95c305e8c1a1acba5f082d294a43793113115691;

fn deploy_erc_20_contract() -> ContractAddress {
    let contract = declare("MyERC20Token").unwrap().contract_class();
    let constructor_data = array![
        0, 0x4d79546f6b656e, 7, // "MyToken"
        0, 0x4d544b, 3, // "MTK"
        0x0f4240,
        0x0, // fixed_supply = 1_000_000 (u256 low, high)
        TOKEN_OWNER // recipient
    ];
    let (contract_address, _) = contract.deploy(@constructor_data).unwrap();
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

            let listing = state.listings.get_listing(nft_address, token_id);

            assert(listing.price == 0, 'price should be zero');
            assert(listing.seller == 0.try_into().unwrap(), 'seller should be zero');
        },
    );

    let marketplace = INFTMarketplaceDispatcher { contract_address: marketplace_address };
    marketplace.list_item(nft_address, token_id, 200);

    interact_with_state(
        marketplace_address,
        || {
            let mut state = NFTMarketplace::contract_state_for_testing();

            let listing = state.listings.get_listing(nft_address, token_id);

            assert(listing.price == 200, 'price should be 200');
            assert(listing.seller == 123.try_into().unwrap(), 'seller should be 123');
        },
    );
}

#[test]
fn test_list_nft_item_two_items() {
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

    nft.create_nft();
    erc721.approve(marketplace_address, 2);
    marketplace.list_item(nft_address, 2, 100);

    spy
        .assert_emitted(
            @array![
                (
                    marketplace_address,
                    NFTMarketplace::Event::ItemListed(
                        ItemListed { seller: caller, nft_address, token_id: 2, price: 100 },
                    ),
                ),
            ],
        );
}

#[test]
fn test_get_listing() {
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

    let listing = marketplace.get_listing(nft_address, token_id);
    assert(listing == Listing { seller: caller, price: 200 }, 'listing does not match');
}

#[test]
fn test_update_listing() {
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

    let listing = marketplace.get_listing(nft_address, token_id);
    assert(listing == Listing { seller: caller, price: 200 }, 'listing does not match');

    marketplace.update_listing(nft_address, token_id, 300);

    let listing = marketplace.get_listing(nft_address, token_id);
    assert(listing == Listing { seller: caller, price: 300 }, 'listing does not match');
}

#[test]
#[should_panic(expected: 'Marketplace: item not listed')]
fn test_update_listing_not_listed() {
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
    marketplace.update_listing(nft_address, token_id, 300);
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

#[test]
fn test_cancel_listing_state() {
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

    interact_with_state(
        marketplace_address,
        || {
            let mut state = NFTMarketplace::contract_state_for_testing();

            let listing = state.listings.get_listing(nft_address, token_id);

            assert(listing.seller == caller, 'seller should be 123');
            assert(listing.price == 200, 'price should be 200');
        },
    );

    marketplace.cancel_listing(nft_address, token_id);

    interact_with_state(
        marketplace_address,
        || {
            let mut state = NFTMarketplace::contract_state_for_testing();

            let listing = state.listings.get_listing(nft_address, token_id);

            assert(listing.price == 0, 'price should be 0');
            assert(listing.seller == 0.try_into().unwrap(), 'seller should be 0');
        },
    );
}

// Test requires slight modification to NFTMarketplace.buy_item to run.
// It requires the contract address of the erc20 token to be passed into the function.
// TODO: Refactor when test setup is better.
#[test]
fn test_buy_item() {
    // Credit buyer with enough STRK tokens
    let token_address = deploy_erc_20_contract();

    let seller: ContractAddress = 123.try_into().unwrap();
    let buyer: ContractAddress = 456.try_into().unwrap();

    // start_cheat_account_contract_address(token_address, FELT_STRK_CONTRACT.try_into().unwrap());
    start_cheat_caller_address(token_address, TOKEN_OWNER.try_into().unwrap());
    let erc20_disptcher = IERC20Dispatcher { contract_address: token_address };
    erc20_disptcher.transfer(buyer, 500);
    stop_cheat_caller_address(token_address);

    let nft_address = deploy_nft_contract("MyNFT");
    let marketplace_address = deploy_marketplace_contract("NFTMarketplace");

    // Create NFT and list on Marketplace
    start_cheat_caller_address(nft_address, seller);
    start_cheat_caller_address(marketplace_address, seller);

    let nft = IMyNFTDispatcher { contract_address: nft_address };
    nft.create_nft();

    let erc721 = IERC721Dispatcher { contract_address: nft_address };
    erc721.approve(marketplace_address, 1);

    let marketplace = INFTMarketplaceDispatcher { contract_address: marketplace_address };
    marketplace.list_item(nft_address, 1, 200);
    stop_cheat_caller_address(marketplace_address);
    stop_cheat_caller_address(nft_address);

    // Purchase listed NFT with buyer account
    start_cheat_account_contract_address(token_address, FELT_STRK_CONTRACT.try_into().unwrap());
    start_cheat_caller_address(marketplace_address, buyer);
    cheat_caller_address(token_address, buyer, CheatSpan::TargetCalls(1));
    erc20_disptcher.approve(marketplace_address, 200);

    let mut spy = spy_events();
    marketplace.buy_item(nft_address, 1, [].span(), token_address);

    let buyer_new_balance = erc20_disptcher.balance_of(buyer);
    assert(buyer_new_balance == 300, 'buyer balance not correct');

    let marketplace_proceeds = marketplace.get_proceeds(seller);
    assert(marketplace_proceeds == 200, 'proceeds balance not correct');

    spy
        .assert_emitted(
            @array![
                (
                    marketplace_address,
                    NFTMarketplace::Event::ItemBought(
                        ItemBought { buyer, nft_address, token_id: 1, price: 200 },
                    ),
                ),
            ],
        );
}

// Test requires slight modification to NFTMarketplace.withdraw_proceeds to run.
// It requires the contract address of the erc20 token to be passed into the function.
// TODO: Refactor when test setup is better.
#[test]
fn test_withdraw_proceeds() {
    // Credit buyer with enough STRK tokens
    let token_address = deploy_erc_20_contract();

    let seller: ContractAddress = 123.try_into().unwrap();
    let buyer: ContractAddress = 456.try_into().unwrap();

    // start_cheat_account_contract_address(token_address, FELT_STRK_CONTRACT.try_into().unwrap());
    start_cheat_caller_address(token_address, TOKEN_OWNER.try_into().unwrap());
    let erc20_disptcher = IERC20Dispatcher { contract_address: token_address };
    erc20_disptcher.transfer(buyer, 500);
    stop_cheat_caller_address(token_address);

    let nft_address = deploy_nft_contract("MyNFT");
    let marketplace_address = deploy_marketplace_contract("NFTMarketplace");

    // Create NFT and list on Marketplace
    start_cheat_caller_address(nft_address, seller);
    start_cheat_caller_address(marketplace_address, seller);

    let nft = IMyNFTDispatcher { contract_address: nft_address };
    nft.create_nft();

    let erc721 = IERC721Dispatcher { contract_address: nft_address };
    erc721.approve(marketplace_address, 1);

    let marketplace = INFTMarketplaceDispatcher { contract_address: marketplace_address };
    marketplace.list_item(nft_address, 1, 200);
    stop_cheat_caller_address(marketplace_address);
    stop_cheat_caller_address(nft_address);

    // Purchase listed NFT with buyer account
    start_cheat_account_contract_address(token_address, FELT_STRK_CONTRACT.try_into().unwrap());
    start_cheat_caller_address(marketplace_address, buyer);
    cheat_caller_address(token_address, buyer, CheatSpan::TargetCalls(1));
    erc20_disptcher.approve(marketplace_address, 200);

    marketplace.buy_item(nft_address, 1, [].span(), token_address);
    stop_cheat_caller_address(marketplace_address);

    start_cheat_caller_address(marketplace_address, seller);
    marketplace.withdraw_proceeds(token_address);

    let seller_new_balance = erc20_disptcher.balance_of(seller);
    assert(seller_new_balance == 200, 'seller balance not correct');
}
