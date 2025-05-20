use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount, MintTo};
use mpl_token_metadata::instructions::{CreateMetadataAccountV3, CreateMasterEditionV3, CreateMasterEditionV3InstructionArgs};
use mpl_token_metadata::types::{DataV2, Creator, CollectionDetails};
use crate::errors::ErrorCode;
use crate::states::deus_config::{self, DeusConfig};


#[derive(Accounts)]
pub struct CreateCollection<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        seeds = [b"deus"],
        bump = deus_config.bump,
        constraint = deus_config.admin == owner.key() @ErrorCode::InvalidAdmin,
    )]
    pub deus_config: Box<Account<'info, DeusConfig>>,

    #[account(
        init,
        payer = owner,
        mint::decimals = 0,
        mint::authority = deus_config.key(),
        mint::freeze_authority = deus_config.key(),
        seeds = [b"collection_mint"],
        bump,
    )]
    pub collection_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = owner,
        token::mint = collection_mint,
        token::authority = deus_config,
        
        seeds = [b"collection_token"],
        bump,
    )]
    pub collection_token: Account<'info, TokenAccount>,

    /// Metaplex Metadata PDA
    /// CHECK: Metaplex validates this account
    #[account(
        mut,
        seeds = [b"metadata", mpl_token_metadata::ID.as_ref(), collection_mint.key().as_ref()],
        bump,
        seeds::program = mpl_token_metadata::ID,
    )]
    pub metadata: UncheckedAccount<'info>,

    /// Master Edition PDA
    /// CHECK: Metaplex validates this account
    #[account(
        mut,
        seeds = [b"metadata", mpl_token_metadata::ID.as_ref(), collection_mint.key().as_ref(), b"edition"],
        bump,
        seeds::program = mpl_token_metadata::ID,
    )]
    pub master_edition: UncheckedAccount<'info>,

    /// The Metaplex Token Metadata program
    /// CHECK: This is the Metaplex Token Metadata Program
    #[account(address = mpl_token_metadata::ID)]
    pub token_metadata_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
}


pub fn handle_create_collection(
    ctx: Context<CreateCollection>,
    name: String,
    symbol: String,
    uri: String,
    max_supply: u64,
) -> Result<()> {
    let creators = vec![
        Creator {
            address: ctx.accounts.deus_config.key(),
            verified: false,
            share: 100,
        },
    ];

    let data = DataV2 {
        name: name.clone(),
        symbol: symbol.clone(),
        uri: uri.clone(),
        seller_fee_basis_points: 0,
        creators: Some(creators.clone()),
        collection: None,
        uses: None,
    };

    let create_metadata_ix = CreateMetadataAccountV3 {
        metadata: ctx.accounts.metadata.key(),
        mint: ctx.accounts.collection_mint.key(),
        mint_authority: ctx.accounts.deus_config.key(),
        payer: ctx.accounts.owner.key(),
        update_authority: (ctx.accounts.deus_config.key(), true),
        system_program: ctx.accounts.system_program.key(),
        rent: Some(ctx.accounts.rent.key()),
    };

    let create_metadata_ix_args = mpl_token_metadata::instructions::CreateMetadataAccountV3InstructionArgs {
        data,
        is_mutable: true,
        collection_details: None,
    };

    let create_metadata_ix = create_metadata_ix.instruction(create_metadata_ix_args);

    anchor_lang::solana_program::program::invoke_signed(
        &create_metadata_ix,
        &[
            ctx.accounts.metadata.to_account_info(),
            ctx.accounts.collection_mint.to_account_info(),
            ctx.accounts.deus_config.to_account_info(), // mint authority
            ctx.accounts.owner.to_account_info(), // payer
            ctx.accounts.deus_config.to_account_info(), // update authority - fixed to match instruction creation
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.rent.to_account_info(),
        ],
        &[&[b"deus", &[ctx.accounts.deus_config.bump]]],
    )?;

    // Mint one token to the collection token account
    msg!("Minting one token");
    anchor_spl::token::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.collection_mint.to_account_info(),
                to: ctx.accounts.collection_token.to_account_info(),
                authority: ctx.accounts.deus_config.to_account_info(),
            },
            &[&[b"deus", &[ctx.accounts.deus_config.bump]]],
        ),
        1,
    )?;

    msg!("Creating master edition");    
    let create_master_edition_ix = CreateMasterEditionV3 {
        edition: ctx.accounts.master_edition.key(),
        mint: ctx.accounts.collection_mint.key(),
        update_authority: ctx.accounts.deus_config.key(),
        mint_authority: ctx.accounts.deus_config.key(),
        payer: ctx.accounts.owner.key(),
        metadata: ctx.accounts.metadata.key(),
        token_program: ctx.accounts.token_program.key(),
        system_program: ctx.accounts.system_program.key(),
        rent: Some(ctx.accounts.rent.key()),
    };

    let create_master_edition_ix_args = mpl_token_metadata::instructions::CreateMasterEditionV3InstructionArgs {
        max_supply: Some(0),
    };

    let create_master_edition_ix = create_master_edition_ix.instruction(create_master_edition_ix_args);

    anchor_lang::solana_program::program::invoke_signed(
        &create_master_edition_ix,
        &[
            ctx.accounts.master_edition.to_account_info(),
            ctx.accounts.collection_mint.to_account_info(),
            ctx.accounts.deus_config.to_account_info(), // update authority
            ctx.accounts.deus_config.to_account_info(), // mint authority
            ctx.accounts.owner.to_account_info(), // payer
            ctx.accounts.metadata.to_account_info(),
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.rent.to_account_info(),
        ],
        &[&[b"deus", &[ctx.accounts.deus_config.bump]]],
        
    )?;

    Ok(())
}