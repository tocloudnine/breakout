use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Already initialized")]
    AlreadyInitialized,
    #[msg("Invalid admin")]
    InvalidAdmin,
    #[msg("Invalid token mint")]
    InvalidTokenMint,
    #[msg("Invalid token owner")]
    InvalidTokenOwner,
    #[msg("Invalid token amount")]
    InvalidTokenAmount,

    #[msg("Invalid treasury")]
    InvalidTreasury,

    #[msg("Invalid fee percentage")]
    InvalidFeePercentage,

    #[msg("Escrow not active")]
    EscrowNotActive,

    #[msg("Invalid seller")]
    InvalidSeller,

    #[msg("Insufficient funds")]
    InsufficientFunds,
}