import { ComputeBudgetProgram, Connection, Keypair, Transaction, TransactionInstruction, TransactionMessage, VersionedTransaction, sendAndConfirmTransaction as solanaConfirmTx } from "@solana/web3.js";
import { BanksClient } from "solana-bankrun";

export const sendTransactionClient = async (
    client: BanksClient,
    instructions: TransactionInstruction[],
    signers: any[]
) => {
    const [blockhash, _] = (await client.getLatestBlockhash())!;
    const tx = new TransactionMessage({
        payerKey: signers[0].publicKey,
        recentBlockhash: blockhash,
        instructions: [
            ComputeBudgetProgram.setComputeUnitLimit({ units: 700000 }),
            ...instructions,
        ],
    }).compileToV0Message([]);
    const transactionV0 = new VersionedTransaction(tx);
    transactionV0.sign(signers);
    const sig = await client.processTransaction(transactionV0 as any);
    return sig;
};

/**
 * Send and confirm transaction on a local validator
 */
export async function sendAndConfirmTransaction(
  connection: Connection,
  instructions: TransactionInstruction[],
  signers: Keypair[]
): Promise<string> {
  const transaction = new Transaction().add(...instructions);
  
  // Set recent blockhash
  transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  transaction.feePayer = signers[0].publicKey;
  
  return await solanaConfirmTx(connection, transaction, signers, {
    commitment: 'confirmed',
    skipPreflight: false,
  });
}