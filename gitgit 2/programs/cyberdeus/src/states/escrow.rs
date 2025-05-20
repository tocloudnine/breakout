use anchor_lang::prelude::*;

#[account]
pub struct Escrow {
    pub bump: u8,
    pub seller: Pubkey,
    pub artist: Pubkey,
    pub nft_mint: Pubkey,
    pub price: u64,
    pub is_active: bool,
    pub created_at: i64,
    /// Name string, max 32 bytes
    pub name: String,
    pub edition: u16,
    pub physical_merchandising_percentage: u64,
    pub digital_resell_percentage: u64,
} 

impl Escrow {
    pub const LEN: usize = 8 + 1 + 32 + 32 + 32 + 8 + 1 + 8 + 4 + 32 + 2 + 8 + 8;
}
