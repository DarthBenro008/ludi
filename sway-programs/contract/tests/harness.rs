use fuels::{
    prelude::*,
    types::Identity,
};
use fuels::types::AssetId;
// Load abi from json
abigen!(Contract(
    name = "MyContract",
    abi = "out/debug/ludi-contract-abi.json"
));

async fn get_contract_instance() -> (MyContract<WalletUnlocked>, Identity) {
    // Launch a local network and deploy the contract
    let mut wallets = launch_custom_provider_and_get_wallets(
        WalletsConfig::new(
            Some(1),             /* Single wallet */
            Some(1),             /* Single coin (UTXO) */
            Some(1_000_000_000), /* Amount per coin */
        ),
        None,
        None,
    )
    .await
    .unwrap();
    let wallet = wallets.pop().unwrap();
    let id = Contract::load_from(
        "./out/debug/ludi-contract.bin",
        LoadConfiguration::default(),
    )
    .unwrap()
    .deploy(&wallet, TxPolicies::default())
    .await
    .unwrap();
    let instance = MyContract::new(id.clone(), wallet);
    (instance, id.into())
}

#[tokio::test]
async fn test_deposit() {
    let (instance, _id) = get_contract_instance().await;

    let asset_id = AssetId::zeroed();

    // Deposit some funds
    let call_params = CallParameters::new(1000, asset_id, 1_000_000);
    let deposit_call = instance.methods().deposit().call_params(call_params).unwrap().call().await.unwrap();


    // Check stake pool
    let stake_pool = instance.methods().get_stake_pool().call().await.unwrap();
    assert_eq!(stake_pool.value, 500); // 60% of 1000

    // Check gamble pool
    let gamble_pool = instance.methods().get_gamble_pool().call().await.unwrap();
    assert_eq!(gamble_pool.value, 500); // 40% of 1000
}

#[tokio::test]
async fn test_withdraw() {
    let (instance, _id) = get_contract_instance().await;
    let asset_id = AssetId::zeroed();
    // First, deposit some funds
    let call_params = CallParameters::new(1000, asset_id, 1_000_000);
    let deposit_call = instance.methods().deposit().call_params(call_params).unwrap().call().await.unwrap();

    // Now, withdraw half of the deposited amount
    let withdraw_amount = 500;
    let withdraw_call = instance.methods().withdraw(withdraw_amount).with_variable_output_policy(VariableOutputPolicy::Exactly(1)).call().await.unwrap();
    let result = withdraw_call.value;
    println!("result: {:?}", result);

    // Check stake pool (should be 300 now)
    let stake_pool = instance.methods().get_stake_pool().call().await.unwrap();
    assert_eq!(stake_pool.value, 0);

    // Check gamble pool (should be 200 now)
    let gamble_pool = instance.methods().get_gamble_pool().call().await.unwrap();
    assert_eq!(gamble_pool.value, 500);
}

#[tokio::test]
async fn test_insufficient_balance() {
    let (instance, _id) = get_contract_instance().await;

    // Try to withdraw without depositing
    let withdraw_amount = 100000;
    let withdraw_call = instance.methods().withdraw(withdraw_amount);
    let result = withdraw_call.call().await.unwrap().value;
    // Check if the withdrawal failed due to insufficient balance
    assert!(result.is_err());
    // You might want to check for a specific error message here, depending on how you've implemented the error handling in your contract
}
