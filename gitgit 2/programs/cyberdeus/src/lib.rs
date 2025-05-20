use anchor_lang::prelude::*;

pub mod states;
pub mod errors;

pub mod instructions;
pub use instructions::*;

declare_id!("5P3yFKQ6yTHfLTD4GfcUXrbCk214cgwFfJ9N9fbPp4xb");

#[program]
pub mod cyberdeus {
    use super::*;

    pub fn initialize_deus(ctx: Context<InitializeDeusConfig>, fee_percentage: u64) -> Result<()> {
        handle_initialize_deus(ctx, fee_percentage)
    }

    pub fn create_collection(ctx: Context<CreateCollection>, name: String, symbol: String, uri: String, max_supply: u64) -> Result<()> {
        handle_create_collection(ctx, name, symbol, uri, max_supply)
    }

    pub fn create_nft(ctx: Context<CreateNft>, name: String, symbol: String, uri: String) -> Result<()> {
        handle_create_nft(ctx, name, symbol, uri)
    }

    pub fn create_escrow(ctx: Context<CreateEscrow>, price: u64, name: String, edition: u16, physical_merchandising_percentage: u64, digital_resell_percentage: u64) -> Result<()> {
        handle_create_escrow(ctx, price, name, edition, physical_merchandising_percentage, digital_resell_percentage)
    }
    
    pub fn buy_nft(ctx: Context<BuyNft>) -> Result<()> {
        handle_buy_nft(ctx)
    }

    pub fn buy_merch(ctx: Context<BuyMerch>) -> Result<()> {
        handle_buy_merch(ctx)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
