use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::states::deus_config::DeusConfig;

#[derive(Accounts)]
pub struct InitializeDeusConfig<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        init,
        payer = owner,
        space = DeusConfig::LEN,
        seeds = [b"deus"],
        bump,
    )]
    pub deus_config: Box<Account<'info, DeusConfig>>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handle_initialize_deus(
    ctx: Context<InitializeDeusConfig>,
    fee_percentage: u64,
) -> Result<()> {
    let deus_config = &mut ctx.accounts.deus_config;

    deus_config.bump = ctx.bumps.deus_config;
    deus_config.admin = ctx.accounts.owner.key();
    deus_config.treasury = ctx.accounts.owner.key();
    deus_config.fee_percentage = fee_percentage;

    Ok(())
}
