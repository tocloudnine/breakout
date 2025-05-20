use anchor_lang::prelude::*;
use anchor_spl::token::{TokenAccount, Token, Mint};
use anchor_spl::associated_token::AssociatedToken;
use mpl_token_metadata::instructions::TransferV1CpiBuilder;
use crate::states::{Escrow, DeusConfig};
use crate::errors::ErrorCode;

#[derive(Accounts)]
pub struct BuyNft<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(mut)]
    pub seller: SystemAccount<'info>,

    #[account(
        seeds = [b"deus"],
        bump = deus_config.bump,
    )]
    pub deus_config: Box<Account<'info, DeusConfig>>,

    /// Treasury account to receive fees
    #[account(
        mut,
        constraint = treasury.key() == deus_config.treasury @ ErrorCode::InvalidTreasury
    )]
    pub treasury: SystemAccount<'info>,

    #[account(
        mut,
        seeds = [b"escrow", escrow.seller.as_ref(), escrow.nft_mint.as_ref()],
        bump = escrow.bump,
        constraint = escrow.seller == seller.key() @ ErrorCode::InvalidSeller,
        constraint = escrow.is_active @ ErrorCode::EscrowNotActive,
    )]
    pub escrow: Box<Account<'info, Escrow>>,

    pub nft_mint: Box<Account<'info, Mint>>,

    /// The escrow token account holding the NFT
    #[account(
        mut,
        seeds = [b"escrow_token", escrow.key().as_ref()],
        bump,
        constraint = escrow_token_account.mint == nft_mint.key() @ ErrorCode::InvalidTokenMint,
        constraint = escrow_token_account.owner == deus_config.key() @ ErrorCode::InvalidTokenOwner,
    )]
    pub escrow_token_account: Box<Account<'info, TokenAccount>>,

    /// The buyer's token account to receive the NFT
    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = nft_mint,
        associated_token::authority = buyer,
    )]
    pub buyer_nft_token: Box<Account<'info, TokenAccount>>,
    
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

pub fn handle_buy_nft(ctx: Context<BuyNft>) -> Result<()> {
    // Calculate fee amount
    let price = ctx.accounts.escrow.price;
    let fee_percentage = ctx.accounts.deus_config.fee_percentage;
    let fee_amount = price.checked_mul(fee_percentage).unwrap().checked_div(10000).unwrap();
    let seller_amount = price.checked_sub(fee_amount).unwrap();

    msg!("Price: {}, Fee: {}, Seller receives: {}", price, fee_amount, seller_amount);

    // 1. Transfer SOL fee to treasury
    if fee_amount > 0 {
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.buyer.to_account_info(),
                    to: ctx.accounts.treasury.to_account_info(),
                },
            ),
            fee_amount,
        )?;
    }

    anchor_lang::system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.seller.to_account_info(),
            },
        ),
        seller_amount,
    )?;

    
    TransferV1CpiBuilder::new(&ctx.accounts.token_metadata_program)
        .token(&ctx.accounts.escrow_token_account.to_account_info())
        .token_owner(&ctx.accounts.deus_config.to_account_info())
        .destination_token(&ctx.accounts.buyer_nft_token.to_account_info())
        .destination_owner(&ctx.accounts.buyer.to_account_info())
        .mint(&ctx.accounts.nft_mint.to_account_info())
        .metadata(&ctx.accounts.nft_metadata.to_account_info())
        .edition(Some(&ctx.accounts.nft_master_edition.to_account_info()))
        .authority(&ctx.accounts.deus_config.to_account_info())
        .payer(&ctx.accounts.buyer.to_account_info())
        .system_program(&ctx.accounts.system_program)
        .sysvar_instructions(&ctx.accounts.sysvar_instructions)
        .spl_token_program(&ctx.accounts.token_program)
        .spl_ata_program(&ctx.accounts.associated_token_program)
        .amount(1)
        .invoke_signed(&[&[
            b"deus", 
            &[ctx.accounts.deus_config.bump]
        ]])?;

    msg!("NFT purchased successfully");

    ctx.accounts.escrow.is_active = false;
    ctx.accounts.escrow.seller = ctx.accounts.buyer.key();
    Ok(())
}
