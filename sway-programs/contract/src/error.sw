library;

pub enum Error {
    VrfRequestFailed: (),
    RoundIsInProgres: (),
    InsufficientBalance: (),
    RandomnessRequestNotFound: (),
    AmountMustBeGreaterThanZero: (),
    GamblePoolExceeded: (),
}
