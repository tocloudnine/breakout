// import {
//   startAnchor,
//   Clock,
//   ProgramTestContext,
//   BanksClient,
// } from "solana-bankrun";
// import {
//   Connection,
//   Keypair,
//   LAMPORTS_PER_SOL,
//   PublicKey,
//   ComputeBudgetProgram,
//   SystemProgram,
//   Transaction,
//   TransactionMessage,
//   VersionedTransaction,
// } from "@solana/web3.js";

// import { BankrunProvider } from "anchor-bankrun";
// import { BN, Program, Provider, Wallet } from "@coral-xyz/anchor";
// import { Cyberdeus } from "../target/types/cyberdeus";
// import IDL from "../target/idl/cyberdeus.json";
// import { createCollection, createEscrow, createNft, initializeDeusConfig, buyNft } from "./lib";
// import { sendTransactionClient } from "./lib/send";
// describe("Bankrun", () => {
//   let context: ProgramTestContext;
//   let client: BanksClient;
//   let provider: BankrunProvider;
//   let program: Program<Cyberdeus>;
//   let owner: Wallet;
//   let buyer: Keypair;
//   let nftMint: Keypair;

//   before(async () => {
//     context = await startAnchor("./",
//       [
//         {
//           name: "cyberdeus",
//           programId: new PublicKey("5P3yFKQ6yTHfLTD4GfcUXrbCk214cgwFfJ9N9fbPp4xb"),
//         },
//         {
//           name: "metaplex",
//           programId: new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
//         },
//       ],
//       []
//     );
//     client = context.banksClient;
//     provider = new BankrunProvider(context);
//     program = new Program<Cyberdeus>(
//       IDL as unknown as Cyberdeus,
//       new PublicKey("5P3yFKQ6yTHfLTD4GfcUXrbCk214cgwFfJ9N9fbPp4xb"),
//       provider as unknown as Provider,
//     );
//     owner = provider.wallet;
    
//     buyer = Keypair.generate();
    
//     const transferToBuyerIx = SystemProgram.transfer({
//       fromPubkey: owner.publicKey,
//       toPubkey: buyer.publicKey,
//       lamports: 10 * LAMPORTS_PER_SOL,
//     });
    
//     await sendTransactionClient(client, [transferToBuyerIx], [owner.payer]);
//   });
  
//   it("init deus", async () => {
//     console.log("init deus");
//     const instructions = await initializeDeusConfig(program, owner.publicKey, 500); // 5% fee
//     const txHash = await sendTransactionClient(client, instructions, [owner.payer]);
//     console.log("txHash", txHash);
//   });
  
//   it("create collection", async () => {
//     console.log("create collection");
//     const instructionsCollection = await createCollection(program, owner.publicKey, "test", "test", "test", 100);
//     const txHashCollection = await sendTransactionClient(client, instructionsCollection, [owner.payer]);

//     // Generate a new keypair for the NFT mint
//     nftMint = Keypair.generate();

//     // Create NFT with reference to the collection
//     const instructionsNft = await createNft(
//       program,
//       owner.publicKey,
//       nftMint.publicKey,
//       "Test NFT",
//       "TEST",
//       "https://example.com/nft.json"
//     );

//     const txHashNft = await sendTransactionClient(client, instructionsNft, [owner.payer, nftMint]);

//     console.log("NFT created with txHash", txHashNft);

//     const priceInLamports = 1 * LAMPORTS_PER_SOL;
//     const instructionsEscrow = await createEscrow(program, owner.publicKey, nftMint.publicKey, priceInLamports);
//     const txHashEscrow = await sendTransactionClient(client, instructionsEscrow, [owner.payer]);

//     console.log("Escrow created with txHash", txHashEscrow);
//   });
  
//   it("buy NFT from escrow", async () => {
//     console.log("Buying NFT from escrow");
    
//     // Create instruction to buy the NFT
//     const instructionsBuy = await buyNft(
//       program,
//       buyer.publicKey,
//       owner.publicKey,
//       nftMint.publicKey
//     );
    
//     const txHashBuy = await sendTransactionClient(client, instructionsBuy, [buyer]);
    
//     console.log("NFT purchased with txHash", txHashBuy);
    
//     const [buyerNftToken] = PublicKey.findProgramAddressSync(
//       [buyer.publicKey.toBuffer(), nftMint.publicKey.toBuffer()],
//       program.programId
//     );
    
//     const tokenAccount = await client.getAccount(buyerNftToken);
//     console.log("Buyer's token account exists:", tokenAccount !== null);
//   });
// });



