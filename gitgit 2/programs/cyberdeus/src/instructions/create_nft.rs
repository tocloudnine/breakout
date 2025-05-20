 use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount, MintTo};
use mpl_token_metadata::instructions::{CreateMetadataAccountV3, CreateMasterEditionV3, VerifyCollectionCpiBuilder, VerifyCollection};
use mpl_token_metadata::types::{DataV2, Creator, Collection};
use crate::errors::ErrorCode;
use crate::states::deus_config::{self, DeusConfig};

#[derive(Accounts)]
pub struct CreateNft<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        seeds = [b"deus"],
        bump = deus_config.bump,
    )]
    pub deus_config: Box<Account<'info, DeusConfig>>,

    #[account(
        init,
        payer = owner,
        mint::decimals = 0,
        mint::authority = deus_config.key(),
        mint::freeze_authority = deus_config.key(),
    )]
    pub nft_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = owner,
        token::mint = nft_mint,
        token::authority = owner,
        seeds = [owner.key().as_ref(), nft_mint.key().as_ref()],
        bump,
    )]
    pub nft_token: Account<'info, TokenAccount>,

    /// Collection mint
    #[account(
        seeds = [b"collection_mint"],
        bump,
    )]
    pub collection_mint: Account<'info, Mint>,

    /// Collection metadata
    /// CHECK: Metaplex validates this account
    #[account(mut)]
    pub collection_metadata: UncheckedAccount<'info>,

    /// Collection master edition
    /// CHECK: Metaplex validates this account
    #[account(
        seeds = [b"metadata", mpl_token_metadata::ID.as_ref(), collection_mint.key().as_ref(), b"edition"],
        bump,
        seeds::program = mpl_token_metadata::ID,
    )]
    pub collection_master_edition: UncheckedAccount<'info>,

    /// Metadata for NFT
    /// CHECK: Metaplex validates this account
    #[account(mut)]
    pub nft_metadata: UncheckedAccount<'info>,

    /// Master Edition for NFT
    /// CHECK: Metaplex validates this account
    #[account(mut)]
    pub master_edition: UncheckedAccount<'info>,

    /// The Metaplex Token Metadata program
    /// CHECK: This is the Metaplex Token Metadata Program
    #[account(address = mpl_token_metadata::ID)]
    pub token_metadata_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
}

pub fn handle_create_nft(
    ctx: Context<CreateNft>,
    name: String,
    symbol: String,
    uri: String,
) -> Result<()> {
    let creators = vec![
        Creator {
            address: ctx.accounts.deus_config.key(),
            verified: false,
            share: 100,
        },
    ];

    let collection = Collection {
        verified: false,
        key: ctx.accounts.collection_mint.key(),
    };

    let data = DataV2 {
        name: name.clone(),
        symbol: symbol.clone(),
        uri: uri.clone(),
        seller_fee_basis_points: 0,
        creators: Some(creators.clone()),
        collection: Some(collection),
        uses: None,
    };

    // Create Metadata
    let create_metadata_ix = CreateMetadataAccountV3 {
        metadata: ctx.accounts.nft_metadata.key(),
        mint: ctx.accounts.nft_mint.key(),
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

    // Invoke create metadata
    anchor_lang::solana_program::program::invoke_signed(
        &create_metadata_ix,
        &[
            ctx.accounts.nft_metadata.to_account_info(),
            ctx.accounts.nft_mint.to_account_info(),
            ctx.accounts.deus_config.to_account_info(),
            ctx.accounts.owner.to_account_info(),
            ctx.accounts.deus_config.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.rent.to_account_info(),
            ctx.accounts.token_metadata_program.to_account_info(),
        ],
        &[&[b"deus", &[ctx.accounts.deus_config.bump]]],
    )?;

    msg!("Minting one token");
    anchor_spl::token::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.nft_mint.to_account_info(),
                to: ctx.accounts.nft_token.to_account_info(),
                authority: ctx.accounts.deus_config.to_account_info(),
            },
            &[&[b"deus", &[ctx.accounts.deus_config.bump]]],
        ),
        1,
    )?;

    // Create Master Edition
    msg!("Creating master edition");
    let create_master_edition_ix = CreateMasterEditionV3 {
        edition: ctx.accounts.master_edition.key(),
        mint: ctx.accounts.nft_mint.key(),
        update_authority: ctx.accounts.deus_config.key(),
        mint_authority: ctx.accounts.deus_config.key(),
        payer: ctx.accounts.owner.key(),
        metadata: ctx.accounts.nft_metadata.key(),
        token_program: ctx.accounts.token_program.key(),
        system_program: ctx.accounts.system_program.key(),
        rent: Some(ctx.accounts.rent.key()),
    };

    let create_master_edition_ix_args = mpl_token_metadata::instructions::CreateMasterEditionV3InstructionArgs {
        max_supply: Some(0), // No editions allowed for this NFT
    };

    let create_master_edition_ix = create_master_edition_ix.instruction(create_master_edition_ix_args);

    // Invoke create master edition
    anchor_lang::solana_program::program::invoke_signed(
        &create_master_edition_ix,
        &[
            ctx.accounts.master_edition.to_account_info(),
            ctx.accounts.nft_mint.to_account_info(),
            ctx.accounts.deus_config.to_account_info(),
            ctx.accounts.deus_config.to_account_info(),
            ctx.accounts.owner.to_account_info(),
            ctx.accounts.nft_metadata.to_account_info(),
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.rent.to_account_info(),
        ],
        &[&[b"deus", &[ctx.accounts.deus_config.bump]]],
    )?;

    msg!("Verifying collection");
    
    // Store account infos in variables to extend their lifetime
    let nft_metadata_info = ctx.accounts.nft_metadata.to_account_info();
    let deus_config_info = ctx.accounts.deus_config.to_account_info();
    let owner_info = ctx.accounts.owner.to_account_info();
    let collection_mint_info = ctx.accounts.collection_mint.to_account_info();
    let collection_metadata_info = ctx.accounts.collection_metadata.to_account_info();
    let collection_master_edition_info = ctx.accounts.collection_master_edition.to_account_info();
    let token_metadata_program_info = ctx.accounts.token_metadata_program.to_account_info();
    
    // Correct builder pattern usage - call the methods sequentially
    let mut verify_builder = VerifyCollectionCpiBuilder::new(
        &token_metadata_program_info
    );
    
    verify_builder.metadata(&nft_metadata_info);
    verify_builder.collection_authority(&deus_config_info);
    verify_builder.payer(&owner_info);
    verify_builder.collection_mint(&collection_mint_info);
    verify_builder.collection(&collection_metadata_info);
    verify_builder.collection_master_edition_account(&collection_master_edition_info);

    verify_builder.invoke_signed(
        &[&[b"deus", &[ctx.accounts.deus_config.bump]]],
    )?;

    Ok(())
}