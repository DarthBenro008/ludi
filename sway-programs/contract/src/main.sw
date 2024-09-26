contract;
mod error;

use std::{
    asset::{transfer},
    auth::msg_sender,
    call_frames::msg_asset_id,
    context::msg_amount,
    hash::Hash,
    identity::Identity,
    storage::storage_map::*,
};

use error::Error;

use vrf_abi::{randomness::{Fulfilled, Randomness, RandomnessState}, Vrf};

const VRF_ID = 0x749a7eefd3494f549a248cdcaaa174c1a19f0c1d7898fa7723b6b2f8ecc4828d;

abi Ludi {
    #[storage(read)]
    fn get_stake_pool() -> u64;

    #[storage(read)]
    fn get_gamble_pool() -> u64;

    #[storage(read, write)]
    fn withdraw(amount: u64) -> Result<(), Error>;

    #[payable]
    #[storage(read, write)]
    fn deposit() -> Result<(), Error>;
}

pub struct DepositLogEvent {
    /// Unique escrow identifier.
    pub identifier: Identity,
    pub amount: u64,
    pub asset_id: AssetId,
}

pub struct LudiDeposit {
    pub id: AssetId,
    pub amount: u64,
}

storage {
    stake_pool: StorageMap<Identity, LudiDeposit> = StorageMap {},
    gamble_pool: StorageMap<Identity, LudiDeposit> = StorageMap {},
    gamble_pool_amount: u64 = 0,
}

impl Ludi for Contract {
    #[storage(read)]
    fn get_stake_pool() -> u64 {
        let sender = msg_sender().unwrap();
        let stake_deposit = storage.stake_pool.get(sender).try_read().unwrap_or(LudiDeposit { id: AssetId::default(), amount: 0 });
        stake_deposit.amount
    }

    #[storage(read)]
    fn get_gamble_pool() -> u64 {
       let sender = msg_sender().unwrap();
       let gamble_deposit = storage.gamble_pool.get(sender).try_read().unwrap_or(LudiDeposit { id: AssetId::default(), amount: 0 });
       gamble_deposit.amount
    }

    #[storage(read, write)]
    fn withdraw(amount: u64) -> Result<(), Error> {
        let identity = msg_sender().unwrap();
        let stake_deposit = storage.stake_pool.get(identity).try_read().unwrap_or(LudiDeposit { id: AssetId::default(), amount: 0 });
        let gamble_deposit = storage.gamble_pool.get(identity).try_read().unwrap_or(LudiDeposit { id: AssetId::default(), amount: 0 });
        let total_balance = stake_deposit.amount + gamble_deposit.amount;

        if total_balance < amount {
            return Err(Error::InsufficientBalance);
        }

        let asset_id = stake_deposit.id;

        // Withdraw from stake pool first
        if amount <= stake_deposit.amount {
            storage.stake_pool.insert(identity, LudiDeposit { id: asset_id, amount: stake_deposit.amount - amount });
        } else {
            let remaining = amount - stake_deposit.amount;
            storage.stake_pool.insert(identity, LudiDeposit { id: asset_id, amount: 0 });
            storage.gamble_pool.insert(identity, LudiDeposit { id: asset_id, amount: gamble_deposit.amount - remaining });
            storage.gamble_pool_amount.write(storage.gamble_pool_amount.read() - remaining);
        }

        transfer(identity, asset_id, amount);
        Ok(())
    }

    #[payable]
    #[storage(read, write)]
    fn deposit() -> Result<(), Error> {
        let identity = msg_sender().unwrap();
        let amount = msg_amount();
        let asset_id = msg_asset_id();

        let stake_amount = (amount * 50) / 100; // 60% to stake pool
        let gamble_amount = amount - stake_amount; // Remaining 40% to gamble pool

        // Update stake pool
        let current_stake = storage.stake_pool.get(identity).try_read().unwrap_or(LudiDeposit { id: asset_id, amount: 0 });
        storage.stake_pool.insert(identity, LudiDeposit { id: asset_id, amount: current_stake.amount + stake_amount });

        // Update gamble pool
        let current_gamble = storage.gamble_pool.get(identity).try_read().unwrap_or(LudiDeposit { id: asset_id, amount: 0 });
        storage.gamble_pool.insert(identity, LudiDeposit { id: asset_id, amount: current_gamble.amount + gamble_amount });

        storage.gamble_pool_amount.write(storage.gamble_pool_amount.read() + gamble_amount);
        log(DepositLogEvent { identifier: identity, amount: amount, asset_id: asset_id });
        Ok(())
    }
}
