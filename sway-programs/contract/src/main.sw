contract;
mod error;

use std::{
    asset::transfer,
    auth::msg_sender,
    call_frames::msg_asset_id,
    context::msg_amount,
    hash::Hash,
    identity::Identity,
    storage::storage_map::*,
};
use error
::Error;
use vrf_abi
::{randomness::{Fulfilled, Randomness, RandomnessState}, Vrf};
const VRF_ID
 = 0x749a7eefd3494f549a248cdcaaa174c1a19f0c1d7898fa7723b6b2f8ecc4828d;
abi Ludi
 {
    #[storage(read)]
    fn get_stake_pool() -> u64;
    #[storage(read)]
    fn get_gamble_pool() -> u64;
    #[storage(read, write)]
    fn withdraw(amount: u64) -> Result<(), Error>;
    #[payable]
    #[storage(read, write)]
    fn deposit() -> Result<(), Error>;
    // #[payable]
    // #[storage(read, write)]
    // fn roll_dice(force: b256) -> Result<(), Error>;
}
pub struct
 DepositLogEvent {
    /// Unique escrow identifier.
    pub identifier: Identity,
    pub amount: u64,
    pub asset_id: AssetId,
}

pub struct RollDiceLogEvent {
    pub identifier: Identity,
    pub force: b256,
    pub amount: u64,
    pub result: bool,
}

pub struct
 LudiDeposit {
    pub id: AssetId,
    pub amount: u64,
    pub gamble_share: u64, // New field to represent share of the gamble pool
}

storage {

    stake_pool: StorageMap<Identity, LudiDeposit> = StorageMap {},
    gamble_pool: StorageMap<Identity, LudiDeposit> = StorageMap {},
    gamble_pool_total: u64 = 0, // Total amount in the gamble pool
}
impl Ludi
 for Contract {
    #[storage(read)]
    fn get_stake_pool() -> u64 {
        let sender = msg_sender().unwrap();
        let stake_deposit = storage.stake_pool.get(sender).try_read().unwrap_or(LudiDeposit {
            id: AssetId::default(),
            amount: 0,
            gamble_share: 0,
        });
        stake_deposit.amount
    }
    #[storage(read)]
    fn get_gamble_pool() -> u64 {
        let sender = msg_sender().unwrap();
        let gamble_deposit = storage.gamble_pool.get(sender).try_read().unwrap_or(LudiDeposit {
            id: AssetId::default(),
            amount: 0,
            gamble_share: 0,
        });
        gamble_deposit.amount
    }
    #[storage(read, write)]
    fn withdraw(amount: u64) -> Result<(), Error> {
        let identity = msg_sender().unwrap();
        let stake_deposit = storage.stake_pool.get(identity).try_read().unwrap_or(LudiDeposit {
            id: AssetId::default(),
            amount: 0,
            gamble_share: 0,
        });
        let gamble_deposit = storage.gamble_pool.get(identity).try_read().unwrap_or(LudiDeposit {
            id: AssetId::default(),
            amount: 0,
            gamble_share: 0,
        });
        let total_balance = stake_deposit.amount + gamble_deposit.amount;
        if total_balance
 < amount {
            return Err(Error::InsufficientBalance);
        }
        let asset_id
 = stake_deposit.id;
        // Withdraw from stake pool first
        if amount
 <= stake_deposit.amount {
            storage
                .stake_pool
                .insert(
                    identity,
                    LudiDeposit {
                        id: asset_id,
                        amount: stake_deposit.amount - amount,
                        gamble_share: stake_deposit.gamble_share,
                    },
                );
        } else {
            let remaining = amount - stake_deposit.amount;
            storage
                .stake_pool
                .insert(
                    identity,
                    LudiDeposit {
                        id: asset_id,
                        amount: 0,
                        gamble_share: stake_deposit.gamble_share,
                    },
                );
            storage
                .gamble_pool
                .insert(
                    identity,
                    LudiDeposit {
                        id: asset_id,
                        amount: gamble_deposit.amount - remaining,
                        gamble_share: gamble_deposit.gamble_share,
                    },
                );
            storage
                .gamble_pool_total
                .write(storage.gamble_pool_total.read() - remaining);
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
        let stake_amount = (amount * 50) / 100; // 50% to stake pool
        let gamble_amount = amount - stake_amount; // Remaining 50% to gamble pool

        // Update stake pool
        let mut current_deposit = storage.stake_pool.get(identity).try_read().unwrap_or(LudiDeposit {
            id: asset_id,
            amount: 0,
            gamble_share: 0,
        });
        current_deposit.amount += stake_amount;

        // Update gamble pool
        let total_gamble_pool = storage.gamble_pool_total.read() + gamble_amount;
        current_deposit.gamble_share = (current_deposit.gamble_share * storage.gamble_pool_total.read() + gamble_amount * 100_000) / total_gamble_pool;

        storage.stake_pool.insert(identity, current_deposit);
        storage.gamble_pool.insert(identity, current_deposit);
        storage.gamble_pool_total.write(total_gamble_pool);

        log(DepositLogEvent {
            identifier: identity,
            amount: amount,
            asset_id: asset_id,
        });
        Ok(())
    }
    // #[payable]
    // #[storage(read, write)]
    // fn roll_dice(force: b256) -> Result<(), Error> {
    //     let sender = msg_sender().unwrap();
    //     let vrf = abi(Vrf, VRF_ID);
    //     let fee = vrf.get_fee(AssetId::base());
    //     let amount = msg_amount();
    //     require(amount > 0, Error::AmountMustBeGreaterThanZero);
    //     let total_gamble_pool = storage.gamble_pool_total.read();
    //     require(amount <= (total_gamble_pool / 2), Error::GamblePoolExceeded);
    //     let _ = vrf.request {
    //         gas: 1_000_000,
    //         asset_id: AssetId::base().bits(),
    //         coins: fee,
    //     }(force);
    //     match vrf.get_request_by_seed(force) {
    //         Some(r) => match r.state {
    //             RandomnessState::Fulfilled(x) => {
    //                 if x.randomness.bits()[0] <= 0x2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa {
    //                     // won
    //                     let winnings = amount * 2;
    //                     require(winnings <= total_gamble_pool, Error::GamblePoolExceeded);

    //                     // Update gamble pool
    //                     let new_total_gamble_pool = total_gamble_pool - winnings;
    //                     storage.gamble_pool_total.write(new_total_gamble_pool);
                        
    //                     // Update winner's deposit
    //                     let mut winner_deposit = storage.gamble_pool.get(sender).try_read().unwrap();
    //                     winner_deposit.gamble_share = (winner_deposit.gamble_share * new_total_gamble_pool) / total_gamble_pool;
    //                     storage.gamble_pool.insert(sender, winner_deposit);

    //                     transfer(sender, AssetId::base(), winnings);
    //                 } else {
    //                     // lost
    //                     let new_total_gamble_pool = total_gamble_pool + amount;
    //                     storage.gamble_pool_total.write(new_total_gamble_pool);

    //                     // Update loser's share
    //                     let mut loser_deposit = storage.gamble_pool.get(sender).try_read().unwrap();
    //                     loser_deposit.gamble_share = (loser_deposit.gamble_share * total_gamble_pool + amount * 100_000) / new_total_gamble_pool;
    //                     storage.gamble_pool.insert(sender, loser_deposit);
    //                 }
    //                 log(RollDiceLogEvent {
    //                     identifier: sender,
    //                     force: force,
    //                     amount: amount,
    //                     result: x.randomness.bits()[0] <= 0x2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa,
    //                 });
    //                 // ... log event ...
    //             },
    //             _ => {
    //                 log("Randomness request is not yet fulfilled.");
    //                 return Err(Error::RandomnessRequestNotFound);
    //             }
    //         },
    //         None => {
    //             log("No randomness request found.");
    //             return Err(Error::RandomnessRequestNotFound);
    //         }
    //     }
    //     Ok(())
    // }
}
