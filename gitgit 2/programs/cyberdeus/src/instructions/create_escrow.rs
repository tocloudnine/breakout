use anchor_lang::prelude::*;
use anchor_spl::token::{TokenAccount, Token};
use anchor_spl::associated_token::AssociatedToken;
use mpl_token_metadata::instructions::TransferV1CpiBuilder;
use crate::states::{Escrow, DeusConfig};
use crate::errors::ErrorCode;

#[derive(Accounts)]
pub struct CreateEscrow<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,

    #[account(
        seeds = [b"deus"],
        bump = deus_config.bump,
    )]
    pub deus_config: Box<Account<'info, DeusConfig>>,

    #[account(
        init,
        payer = seller,
        space = 8 + std::mem::size_of::<Escrow>(),
        seeds = [b"escrow", seller.key().as_ref(), nft_mint.key().as_ref()],
        bump,
    )]
    pub escrow: Box<Account<'info, Escrow>>,

    /// The mint of the NFT
    pub nft_mint: Box<Account<'info, anchor_spl::token::Mint>>,

    /// The token account holding the NFT
    #[account(
        mut,
        constraint = seller_nft_token.mint == nft_mint.key() @ErrorCode::InvalidTokenMint,
        constraint = seller_nft_token.owner == seller.key() @ErrorCode::InvalidTokenOwner,
        constraint = seller_nft_token.amount == 1 @ErrorCode::InvalidTokenAmount,
    )]
    pub seller_nft_token: Box<Account<'info, TokenAccount>>,

    /// The escrow token account that will hold the NFT
    #[account(
        init_if_needed,
        payer = seller,
        token::mint = nft_mint,
        token::authority = deus_config,
        seeds = [b"escrow_token", escrow.key().as_ref()],
        bump,
    )]
    pub escrow_token_account: Box<Account<'info, TokenAccount>>,
    
    /// The metadata account of the NFT
    /// CHECK: Validated by Metaplex
    #[account(mut)]
    pub nft_metadata: UncheckedAccount<'info>,
    
    /// The master edition account of the NFT
    /// CHECK: Validated by Metaplex
    #[account(mut)]
    pub nft_master_edition: UncheckedAccount<'info>,
    
    /// CHECK: We check the ID
    #[account(address = mpl_token_metadata::ID)]
    pub token_metadata_program: UncheckedAccount<'info>,
    
    /// CHECK: Used in CPI
    pub sysvar_instructions: UncheckedAccount<'info>,
    
    /// SPL Associated Token program
    pub associated_token_program: Program<'info, AssociatedToken>,
    
    /// System program
    pub system_program: Program<'info, System>,
    
    /// Token program
    pub token_program: Program<'info, Token>,
    
    pub rent: Sysvar<'info, Rent>,
}

pub fn handle_create_escrow(
    ctx: Context<CreateEscrow>,
    price: u64,
    name: String,
    edition: u16,
    physical_merchandising_percentage: u64,
    digital_resell_percentage: u64,
) -> Result<()> {
    let current_time = Clock::get()?.unix_timestamp;
    
    
    TransferV1CpiBuilder::new(&ctx.accounts.token_metadata_program)
        .token(&ctx.accounts.seller_nft_token.to_account_info())
        .token_owner(&ctx.accounts.seller)
        .destination_token(&ctx.accounts.escrow_token_account.to_account_info())
        .destination_owner(&ctx.accounts.deus_config.to_account_info())
        .mint(&ctx.accounts.nft_mint.to_account_info())
        .metadata(&ctx.accounts.nft_metadata.to_account_info())
        .edition(Some(&ctx.accounts.nft_master_edition.to_account_info()))
        .authority(&ctx.accounts.seller.to_account_info())
        .payer(&ctx.accounts.seller.to_account_info())
        .system_program(&ctx.accounts.system_program)
        .sysvar_instructions(&ctx.accounts.sysvar_instructions)
        .spl_token_program(&ctx.accounts.token_program)
        .spl_ata_program(&ctx.accounts.associated_token_program)
        .amount(1)
        .invoke()?;

    ctx.accounts.escrow.bump = ctx.bumps.escrow;
    ctx.accounts.escrow.seller = ctx.accounts.seller.key();
    ctx.accounts.escrow.nft_mint = ctx.accounts.nft_mint.key();
    ctx.accounts.escrow.price = price;
    ctx.accounts.escrow.is_active = true;
    ctx.accounts.escrow.created_at = current_time;
    ctx.accounts.escrow.name = name;
    ctx.accounts.escrow.edition = edition;
    ctx.accounts.escrow.physical_merchandising_percentage = physical_merchandising_percentage;
    ctx.accounts.escrow.digital_resell_percentage = digital_resell_percentage;
    ctx.accounts.escrow.artist = ctx.accounts.seller.key();
    
    msg!("Escrow created successfully");
    Ok(())
}
