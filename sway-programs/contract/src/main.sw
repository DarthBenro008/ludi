contract;
mod error;

use std::{
    auth::msg_sender,
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
    fn deposit();
}

storage {
    stake_pool: StorageMap<Identity, u64> = StorageMap {},
    gamble_pool: StorageMap<Identity, u64> = StorageMap {},
    gamble_pool_amount: u64 = 0,
}

impl Ludi for Contract {
    #[storage(read)]
    fn get_stake_pool() -> u64 {
        let sender = msg_sender().unwrap();
        storage.stake_pool.get(sender).try_read().unwrap_or(0)
    }

    #[storage(read)]
    fn get_gamble_pool() -> u64 {
       let sender = msg_sender().unwrap();
       storage.gamble_pool.get(sender).try_read().unwrap_or(0)
    }

    #[storage(read, write)]
    fn withdraw(amount: u64) -> Result<(), Error> {
        let identity = msg_sender().unwrap();
        let stake_balance = storage.stake_pool.get(identity).try_read().unwrap_or(0);
        let gamble_balance = storage.gamble_pool.get(identity).try_read().unwrap_or(0);
        let total_balance = stake_balance + gamble_balance;

        if total_balance < amount {
            return Err(Error::InsufficientBalance);
        }

        // Withdraw from stake pool first
        if amount <= stake_balance {
            storage.stake_pool.insert(identity, stake_balance - amount);
        } else {
            let remaining = amount - stake_balance;
            storage.stake_pool.insert(identity, 0);
            storage.gamble_pool.insert(identity, gamble_balance - remaining);
            storage.gamble_pool_amount.write(storage.gamble_pool_amount.read() - remaining );
        }

        // Transfer the funds (this is a placeholder, adjust according to your blockchain's specifics)
        // transfer(amount, identity);

        Ok(())
    }

    #[payable]
    #[storage(read, write)]
    fn deposit() {
        let identity = msg_sender().unwrap();
        let amount = msg_amount();

        let stake_amount = (amount * 60) / 100; // 60% to stake pool
        let gamble_amount = amount - stake_amount; // Remaining 40% to gamble pool

        let current_stake = storage.stake_pool.get(identity).try_read().unwrap_or(0);
        storage.stake_pool.insert(identity, current_stake + stake_amount);

        let current_gamble = storage.gamble_pool.get(identity).try_read().unwrap_or(0);
        storage.gamble_pool.insert(identity, current_gamble + gamble_amount);

         storage.gamble_pool_amount.write(storage.gamble_pool_amount.read() - gamble_amount );
    }
}