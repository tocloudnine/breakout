use anchor_lang::prelude::*;

#[account]
pub struct DeusConfig {
    pub bump: u8,

    pub admin: Pubkey,
    pub treasury: Pubkey,
    pub fee_percentage: u64,

    pub padding: [u64; 20],
}

impl DeusConfig {
    pub const LEN: usize = 8 + 1 + 32 + 32 + 8 + 20 * 8;

}
