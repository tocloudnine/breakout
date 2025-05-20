import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
  RpcResponseAndContext,
  Signer,
  SimulatedTransactionResponse,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { toast } from "sonner";

export async function manualSendTransactionV0(
  instructions: TransactionInstruction[],
  user: PublicKey,
  connection: Connection,
  signTransaction: any,
  toast: any,
  signers: Keypair[] = []
) {

  const txMsg = new TransactionMessage({
    payerKey: user,
    recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
    instructions: [
      ComputeBudgetProgram.setComputeUnitLimit({ units: 600000 }),
      ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1000 }),
      ...instructions,
    ],
  }).compileToV0Message([]);

  const versionedTx = new VersionedTransaction(txMsg);
  const signedTransaction = await signTransaction(versionedTx);
  if (signers.length > 0) {
    signedTransaction.sign(signers);
  }
  console.log(signedTransaction)
  toast.loading("Transaction sending...")
  const txSig = await connection.sendTransaction(signedTransaction, {
    skipPreflight: true,
    preflightCommitment: "confirmed",
  });
  console.log(
    `sent raw, waiting : https://explorer.solana.com/tx/${txSig}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`
  );
  await connection.confirmTransaction(txSig, "confirmed");
  toast.success("Transaction sent successfully")

  if (typeof window !== 'undefined') {
    window.open(`https://explorer.solana.com/tx/${txSig}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`, '_blank');
  }
  return txSig
}

export async function manualSendTransaction(
  instructions: TransactionInstruction[],
  publicKey: PublicKey,
  connection: Connection,
  signTransaction: any
) {
  const transaction = new Transaction();
  transaction.add(...instructions);
  transaction.feePayer = publicKey;
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;

  const signedTransaction = await signTransaction(transaction);
  const rawTransaction = signedTransaction.serialize();

  let signature = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: false,
  });

  console.log(
    `sent raw, waiting : https://explorer.solana.com/tx/${signature}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`
  );

  const confirm = async () =>
    await connection.confirmTransaction(signature, "confirmed");

  console.log(
    `sent tx!!! :https://explorer.solana.com/tx/${signature}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`
  );
}