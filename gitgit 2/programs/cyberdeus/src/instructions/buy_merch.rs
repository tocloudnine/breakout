use anchor_lang::prelude::*;
use crate::states::{Escrow, DeusConfig};
use crate::errors::ErrorCode;

#[derive(Accounts)]
pub struct BuyMerch<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(mut)]
    pub seller: SystemAccount<'info>,

    #[account(
        seeds = [b"deus"],
        bump = deus_config.bump,
    )]
    pub deus_config: Box<Account<'info, DeusConfig>>,
    
    #[account(
        mut,
        constraint = artist.key() == escrow.artist @ ErrorCode::InvalidTreasury,
    )]
    pub artist: SystemAccount<'info>,


    #[account(
        mut,
        constraint = treasury.key() == deus_config.treasury @ ErrorCode::InvalidTreasury
    )]
    pub treasury: SystemAccount<'info>,

    #[account(
        mut,
        constraint = escrow.seller == seller.key() @ ErrorCode::InvalidSeller,
    )]
    pub escrow: Box<Account<'info, Escrow>>,

    /// System program
    pub system_program: Program<'info, System>,
}

pub fn handle_buy_merch(ctx: Context<BuyMerch>) -> Result<()> {
    let price = ctx.accounts.escrow.price;
    let fee_percentage = ctx.accounts.deus_config.fee_percentage;
    let fee_amount = price.checked_mul(fee_percentage).unwrap().checked_div(10000).unwrap();
    let seller_amount = price.checked_sub(fee_amount).unwrap();

    msg!("Price: {}, Fee: {}, Seller receives: {}", price, fee_amount, seller_amount);

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

    let physical_merchandising_percentage = ctx.accounts.escrow.physical_merchandising_percentage;
    let digital_resell_percentage = ctx.accounts.escrow.digital_resell_percentage;
    
    let physical_merchandising_amount = price.checked_mul(physical_merchandising_percentage).unwrap().checked_div(10000).unwrap();
    let digital_resell_amount = price.checked_mul(digital_resell_percentage).unwrap().checked_div(10000).unwrap();

    if physical_merchandising_amount > 0 {
        msg!("Physical merchandising amount for ARTIST: {}", physical_merchandising_amount);
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.artist.to_account_info(),
            },
        ),
            physical_merchandising_amount,
        )?;
    }

    if digital_resell_amount > 0 {
        msg!("Digital resell amount for Holder: {}", digital_resell_amount);
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.seller.to_account_info(),
            },
        ),
            seller_amount.checked_sub(physical_merchandising_amount).unwrap(),
        )?;
    }

    msg!("Merchandise purchased successfully");

    

    Ok(())
}
