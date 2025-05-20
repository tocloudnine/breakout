import { PublicKey } from "@solana/web3.js";
import { Cyberdeus } from "../../target/types/cyberdeus";
import { Program } from "@coral-xyz/anchor";


export const DEUS_SEED = Buffer.from("deus");
export const METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");


export function deriveDeusConfigPDA(programId: PublicKey) {
    const [positionPDA] = PublicKey.findProgramAddressSync(
        [DEUS_SEED],
        programId,
    );
    return positionPDA;
}

export function deriveCollectionMintPDA(programId: PublicKey) {
    const [collectionMint] = PublicKey.findProgramAddressSync(
        [Buffer.from("collection_mint")],
        programId
    );
    return collectionMint;
}

export function deriveCollectionTokenPDA(programId: PublicKey) {
    const [collectionToken] = PublicKey.findProgramAddressSync(
        [Buffer.from("collection_token")],
        programId
    );
    return collectionToken;
}

export function deriveMetadataPDA(mint: PublicKey) {
    const [metadata] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("metadata"),
            METADATA_PROGRAM_ID.toBuffer(),
            mint.toBuffer(),
        ],
        METADATA_PROGRAM_ID
    );
    return metadata;
}

export function deriveMasterEditionPDA(mint: PublicKey) {
    const [masterEdition] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("metadata"),
            METADATA_PROGRAM_ID.toBuffer(),
            mint.toBuffer(),
            Buffer.from("edition"),
        ],
        METADATA_PROGRAM_ID
    );
    return masterEdition;
}

export function deriveNftTokenPDA(owner: PublicKey, nftMint: PublicKey, programId: PublicKey) {
    const [nftToken] = PublicKey.findProgramAddressSync(
        [owner.toBuffer(), nftMint.toBuffer()],
        programId
    );
    return nftToken;
}

export function deriveEscrowPDA(seller: PublicKey, nftMint: PublicKey, programId: PublicKey) {
    const [escrow] = PublicKey.findProgramAddressSync(
        [Buffer.from("escrow"), seller.toBuffer(), nftMint.toBuffer()],
        programId
    );
    return escrow;
}

export function deriveEscrowTokenAccountPDA(escrow: PublicKey, programId: PublicKey) {
    const [escrowTokenAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("escrow_token"), escrow.toBuffer()],
        programId
    );
    return escrowTokenAccount;
}