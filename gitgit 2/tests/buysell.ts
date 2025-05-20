import * as anchor from "@coral-xyz/anchor";
import { Program} from "@coral-xyz/anchor";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { Cyberdeus } from "../target/types/cyberdeus";
import { createCollection, createEscrow, createNft, initializeDeusConfig, buyNft, buyMerch } from "./lib";


describe("Cyberdeus NFT Tests", () => {
  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());
  
  const program = anchor.workspace.Cyberdeus as Program<Cyberdeus>;
  const provider = anchor.getProvider();
  const connection = provider.connection;
  // @ts-ignore
  const wallet: Keypair = anchor.AnchorProvider.env().wallet.payer;
  let nftMint: Keypair;
  let buyer: Keypair;
  
  // Helper function to work around type conflicts
  async function sendTx(instructions: any[], signers: Keypair[] ): Promise<string> {
    const tx = new Transaction();
    tx.add(...instructions);
    tx.feePayer = signers[0].publicKey;
    
    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    
    tx.sign(...signers);
    
    const signature = await connection.sendRawTransaction(tx.serialize());
    await connection.confirmTransaction(signature);
    
    return signature;
  }

  
  before("Setup accounts and airdrop", async () => {
    buyer = Keypair.generate();
    const instructions = await SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: buyer.publicKey,
      lamports: 10 * LAMPORTS_PER_SOL,
    });
    const txHash = await sendTx([instructions], [wallet]);
    console.log("Buyer funded with tx:", txHash); 
  });
  
  it("Initialize Deus Config", async () => {
    console.log("Initializing Deus config...");
    const instructions = await initializeDeusConfig(program, wallet.publicKey, 500); // 5% fee
    
    const signers = [
      wallet
    ];
    
    const txHash = await sendTx(instructions, [wallet]);
    console.log("Deus config initialized with tx:", txHash);
  });
  
  it("Create NFT Collection", async () => {
    console.log("Creating collection...");
    const instructions = await createCollection(
      program, 
      wallet.publicKey, 
      "Test Collection", 
      "TESTCOL", 
      "https://example.com/collection.json", 
      100
    );
    
    // Get the keypair from the wallet
    const signers = [
      // @ts-ignore - accessing private property, but safe in testing environment
      wallet.payer || Keypair.fromSecretKey(wallet.secretKey)
    ];
    
    const txHash = await sendTx(instructions, signers);
    console.log("Collection created with tx:", txHash);
  });
  
  

  it("Create Escrow for NFT2", async () => {
    nftMint = Keypair.generate();
    const instructionsMint = await createNft(
      program,
      wallet.publicKey,
      nftMint.publicKey,
      "Test NFT",
      "TEST",
      "https://example.com/nft.json"
    );

    // Get the keypair from the wallet
    const signers = [
      // @ts-ignore - accessing private property, but safe in testing environment
      wallet.payer || Keypair.fromSecretKey(wallet.secretKey),
      nftMint
    ];

    const priceInLamports = 1 * LAMPORTS_PER_SOL;
    const instructions = await createEscrow(
      program,
      wallet.publicKey,
      nftMint.publicKey,
      priceInLamports,
      "abstr",
      10,
      500,
      500
    );



    const txHash = await sendTx([...instructionsMint, ...instructions], signers);
    console.log("Escrow created with tx:", txHash);
  });

  it("Create Escrow for NFT2", async () => {
    nftMint = Keypair.generate();
    const instructionsMint = await createNft(
      program,
      wallet.publicKey,
      nftMint.publicKey,
      "Test NFT",
      "TEST",
      "https://example.com/nft.json"
    );

    // Get the keypair from the wallet
    const signers = [
      // @ts-ignore - accessing private property, but safe in testing environment
      wallet.payer || Keypair.fromSecretKey(wallet.secretKey),
      nftMint
    ];

    const priceInLamports = 1 * LAMPORTS_PER_SOL;
    const instructions = await createEscrow(
      program,
      wallet.publicKey,
      nftMint.publicKey,
      priceInLamports,
      "car",
      10,
      500,
      500
    );



    const txHash = await sendTx([...instructionsMint, ...instructions], signers);
    console.log("Escrow created with tx:", txHash);
  });

  it("Create Escrow for NFT2", async () => {
    nftMint = Keypair.generate();
    const instructionsMint = await createNft(
      program,
      wallet.publicKey,
      nftMint.publicKey,
      "Test NFT",
      "TEST",
      "https://example.com/nft.json"
    );

    // Get the keypair from the wallet
    const signers = [
      // @ts-ignore - accessing private property, but safe in testing environment
      wallet.payer || Keypair.fromSecretKey(wallet.secretKey),
      nftMint
    ];

    const priceInLamports = 1 * LAMPORTS_PER_SOL;
    const instructions = await createEscrow(
      program,
      wallet.publicKey,
      nftMint.publicKey,
      priceInLamports,
      "bonk",
      10,
      400,
      600
    );



    const txHash = await sendTx([...instructionsMint, ...instructions], signers);
    console.log("Escrow created with tx:", txHash);

    const instructions1 = await buyMerch(
      program,
      buyer.publicKey,
      wallet.publicKey,
      nftMint.publicKey
    );
    
    const txHash1 = await sendTx(instructions1, [buyer]);
    console.log("Merch purchased with tx:", txHash1);
  });
  // it("Buy NFT from Escrow", async () => {
  //   console.log("Buying NFT from escrow...");
  //   const instructions = await buyNft(
  //     program,
  //     buyer.publicKey,
  //     wallet.publicKey,
  //     nftMint.publicKey
  //   );
    
  //   const txHash = await sendTx(instructions, [buyer]);
  //   console.log("NFT purchased with tx:", txHash);
    
  //   // Verify buyer has the NFT token
  //   const [buyerNftToken] = PublicKey.findProgramAddressSync(
  //     [buyer.publicKey.toBuffer(), nftMint.publicKey.toBuffer()],
  //     program.programId
  //   );
    
  //   const tokenAccount = await connection.getAccountInfo(buyerNftToken);
  //   console.log("Buyer's token account exists:", tokenAccount !== null);
  // });
});
