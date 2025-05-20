import { SYSVAR_RENT_PUBKEY, TransactionInstruction, SYSVAR_INSTRUCTIONS_PUBKEY } from "@solana/web3.js"
import { SystemProgram } from "@solana/web3.js"
import { BN } from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js"
import { 
    deriveDeusConfigPDA, 
    deriveCollectionMintPDA, 
    deriveCollectionTokenPDA,
    deriveMetadataPDA,
    deriveMasterEditionPDA,
    deriveNftTokenPDA,
    deriveEscrowPDA,
    deriveEscrowTokenAccountPDA
} from "./derive";
import { Cyberdeus } from "@/lib/IDL/cyberdeus";
import { getAssociatedTokenAddress } from "@solana/spl-token";

const METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

export async function initializeDeusConfig(
      program: Program<Cyberdeus>,
      user: PublicKey,
      fee_percentage: number,
  ): Promise < TransactionInstruction[] > {
      const instructions: TransactionInstruction[] = [];

      const deusConfig = deriveDeusConfigPDA(program.programId);

      const ix = await program.methods
          .initializeDeus(new BN(fee_percentage))
          .accounts({
              deusConfig,
              owner: user,
              systemProgram: SystemProgram.programId,
              rent: SYSVAR_RENT_PUBKEY,
          })
          .instruction();

      instructions.push(ix);

      return instructions;
  }

export async function createCollection(
    program: Program<Cyberdeus>,
    owner: PublicKey,
    name: string,
    symbol: string,
    uri: string,
    maxSupply: number,
): Promise<TransactionInstruction[]> {
    const instructions: TransactionInstruction[] = [];
    
    const deusConfig = deriveDeusConfigPDA(program.programId);
    
    // Derive collection mint PDA
    const collectionMint = deriveCollectionMintPDA(program.programId);
    
    // Derive metadata account
    const metadata = deriveMetadataPDA(collectionMint);
    
    // Derive master edition account
    const masterEdition = deriveMasterEditionPDA(collectionMint);

    const collectionToken = deriveCollectionTokenPDA(program.programId);
    
    const ix = await program.methods
        .createCollection(name, symbol, uri, new BN(maxSupply))
        .accounts({
            owner,
            deusConfig,
            collectionMint,
            metadata,
            collectionToken,
            masterEdition,
            tokenMetadataProgram: METADATA_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
            tokenProgram: TOKEN_PROGRAM_ID,
        })
        .instruction();
    
    instructions.push(ix);
    
    return instructions;
}

export async function createNft(
    program: Program<Cyberdeus>,
    owner: PublicKey,
    nftMint: PublicKey,
    name: string,
    symbol: string,
    uri: string,
): Promise<TransactionInstruction[]> {
    const instructions: TransactionInstruction[] = [];

    const deusConfig = deriveDeusConfigPDA(program.programId);

    const collectionMint = deriveCollectionMintPDA(program.programId);
    const collectionMetadata = deriveMetadataPDA(collectionMint);
    const collectionMasterEdition = deriveMasterEditionPDA(collectionMint);
    const nftToken = deriveNftTokenPDA(owner, nftMint, program.programId);

    const nftMetadata = deriveMetadataPDA(nftMint);
    const nftMasterEdition = deriveMasterEditionPDA(nftMint);

    const ix = await program.methods
        .createNft(name, symbol, uri)
        .accounts({
            owner,
            deusConfig,
            nftMint,
            nftToken,
            collectionMint,
            collectionMetadata,
            collectionMasterEdition,
            nftMetadata,
            masterEdition: nftMasterEdition,
            tokenMetadataProgram: METADATA_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
            tokenProgram: TOKEN_PROGRAM_ID,
        })
        .instruction();

    instructions.push(ix);

    return instructions;
}

export async function createEscrow(
    program: Program<Cyberdeus>,
    seller: PublicKey,
    nftMint: PublicKey,
    price: number,
    name: string,
    edition: number,
    physical_merchandising_percentage: number,
    digital_resell_percentage: number,
): Promise<TransactionInstruction[]> {

    const instructions: TransactionInstruction[] = [];

    const deusConfig = deriveDeusConfigPDA(program.programId);

    const escrow = deriveEscrowPDA(seller, nftMint, program.programId);

    const sellerNftToken = deriveNftTokenPDA(seller, nftMint, program.programId);

    const escrowTokenAccount = deriveEscrowTokenAccountPDA(escrow, program.programId);

    const nftMetadata = deriveMetadataPDA(nftMint);

    const nftMasterEdition = deriveMasterEditionPDA(nftMint);

    const ix = await program.methods
        .createEscrow(new BN(price), name, edition, new BN(physical_merchandising_percentage), new BN(digital_resell_percentage))
        .accounts({
            seller,
            deusConfig,
            escrow,
            nftMint,
            sellerNftToken,
            escrowTokenAccount,
            nftMetadata,
            nftMasterEdition,
            tokenMetadataProgram: METADATA_PROGRAM_ID,
            sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY,
        })
        .instruction();

    instructions.push(ix);

    return instructions;
}

export async function buyNft(
    program: Program<Cyberdeus>,
    buyer: PublicKey,
    seller: PublicKey,
    nftMint: PublicKey,
): Promise<TransactionInstruction[]> {
    const instructions: TransactionInstruction[] = [];

    const deusConfig = deriveDeusConfigPDA(program.programId);
    
    const deusConfigData = await program.account.deusConfig.fetch(deusConfig);
    const treasury = deusConfigData.treasury;

    const escrow = deriveEscrowPDA(seller, nftMint, program.programId);

    const escrowTokenAccount = deriveEscrowTokenAccountPDA(escrow, program.programId);

    const buyerNftToken = await getAssociatedTokenAddress(
        nftMint,
        buyer,
        false
    );

    const nftMetadata = deriveMetadataPDA(nftMint);

    const nftMasterEdition = deriveMasterEditionPDA(nftMint);

    const ix = await program.methods
        .buyNft()
        .accounts({
            buyer,
            seller,
            deusConfig,
            treasury,
            escrow,
            nftMint,
            escrowTokenAccount,
            buyerNftToken: buyerNftToken,
            nftMetadata,
            nftMasterEdition,
            tokenMetadataProgram: METADATA_PROGRAM_ID,
            sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY,
        })
        .instruction();

    instructions.push(ix);

    return instructions;
}

export async function buyMerch(
    program: Program<Cyberdeus>,
    buyer: PublicKey,
    seller: PublicKey,
    nftMint: PublicKey,
): Promise<TransactionInstruction[]> {
    const instructions: TransactionInstruction[] = [];

    const deusConfig = deriveDeusConfigPDA(program.programId);

    const deusConfigData = await program.account.deusConfig.fetch(deusConfig);
    const treasury = deusConfigData.treasury;

    const escrow = deriveEscrowPDA(seller, nftMint, program.programId);

    const escrowData = await program.account.escrow.fetch(escrow);
    const artist = escrowData.artist;

    const ix = await program.methods
        .buyMerch()
        .accounts({
            buyer,
            seller,
            deusConfig,
            artist,
            treasury,
            escrow,
            systemProgram: SystemProgram.programId,
        })
        .instruction();

    instructions.push(ix);

    return instructions;
}