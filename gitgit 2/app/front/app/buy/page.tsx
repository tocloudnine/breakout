"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useProgram } from "@/api/useProgram";
import { buyNft } from "@/lib/index";
import { toast } from "sonner";
import { manualSendTransactionV0 } from "@/lib/send";

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%231E1E1E'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' text-anchor='middle' fill='white'%3ENFT%3C/text%3E%3C/svg%3E";

interface Nft {
  mintKey: string;
  escrowKey: string;
  price: number;
  sellerKey: string;
  imageUrl: string;
  name: string;
  edition: number;
  physicalMerchandisingPercentage: number;
  digitalResellPercentage: number;  
}

export default function BuyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mintKey = searchParams.get("mintKey");
  const escrowKey = searchParams.get("escrowKey");

  const [isLoading, setIsLoading] = useState(false);
  const [nft, setNft] = useState<Nft | null>(null);
  const [isBought, setIsBought] = useState(false);
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const program = useProgram(connection);

  useEffect(() => {
    if (!mintKey || !program) return;

    const loadNftDetails = async () => {
      try {
        if (!escrowKey) {
          toast.error("NFT not found");
          router.push("/");
          return;
        }
        
        const escrowAccounts = await program.account.escrow.fetch(new PublicKey(escrowKey))
        console.log(escrowAccounts)
        const storedImage = typeof window !== 'undefined' ?
          localStorage.getItem(`image_${mintKey}`) : null;

        setNft({
          mintKey: mintKey,
          escrowKey: escrowKey,
          price: +escrowAccounts.price / 10 ** 9,
          sellerKey: escrowAccounts.seller.toString(),
          imageUrl: storedImage || PLACEHOLDER_IMAGE,
          name: escrowAccounts.name,
          edition: escrowAccounts.edition,
          physicalMerchandisingPercentage: escrowAccounts.physicalMerchandisingPercentage.toNumber(),
          digitalResellPercentage: escrowAccounts.digitalResellPercentage.toNumber()
        });

      } catch (e) {
        console.error("Error loading NFT details:", e);
        toast.error("Error loading NFT details");
      }
    };

    loadNftDetails();
  }, [mintKey, program, router]);

  const handleBuyNft = async () => {
    if (!program || !publicKey || !signTransaction || !nft) {
      toast.error("Please connect your wallet");
      return;
    }

    setIsLoading(true);

    try {
      const nftMintKey = new PublicKey(nft.mintKey);
      const sellerKey = new PublicKey(nft.sellerKey);

      const buyInstructions = await buyNft(
        program,
        publicKey,
        sellerKey,
        nftMintKey
      );

      await manualSendTransactionV0(
        buyInstructions,
        publicKey,
        connection,
        signTransaction,
        toast
      );

      toast.success("NFT purchased successfully!");
      setIsBought(true);
    } catch (e) {
      console.error("Error buying NFT:", e);
      toast.error("Error buying NFT");
    } finally {
      setIsLoading(false);
    }
  };

  if (!nft) {
    return (
      <section className="bg-black text-white max-w-md mx-auto flex flex-col h-full">
        <div className="flex-1 p-4">
          <h2 className="text-3xl font-light mb-3">Loading NFT details...</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black text-white max-w-md mx-auto flex flex-col h-full">
      <div className="flex-1 p-4">
        <h2 className="text-3xl font-light mb-3">Buy NFT</h2>

        <div className="flex justify-between mb-2">
          <div className="flex gap-1">
            <div className="w-2 h-1 bg-gray-500"></div>
            <div className="w-2 h-1 bg-gray-500"></div>
            <div className="w-8 h-1 bg-white"></div>
          </div>
        </div>

        {/* NFT Preview */}
        <div className="mb-6">
          <div className="w-full mb-4">
            <Image
              src={`/images/${nft.name}.jpg`}
              alt="NFT image"
              width={400}
              height={400}
              className="w-full aspect-square object-contain"
            />
          </div>

          <div className="bg-[#1E1E1E] p-4 space-y-3">
            <div>
              <div className="text-gray-400 text-xs">Name</div>
              <div className="text-white text-xs truncate">{nft.name}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Edition</div>
              <div className="text-white text-xs truncate">{nft.edition}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Physical Merchandising Percentage</div>
              <div className="text-white text-xs truncate">{nft.physicalMerchandisingPercentage / 100}%</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Digital Resell Percentage</div>
              <div className="text-white text-xs truncate">{nft.digitalResellPercentage / 100}%</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Seller</div>
              <div className="text-white text-xs truncate">{nft.sellerKey}</div>
            </div>

            <div>
              <div className="text-gray-400 text-xs">Price</div>
              <div className="text-white">{nft.price.toFixed(2)} SOL</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Buy button */}
      {(program && publicKey && signTransaction) ? (
        <div className="p-4 bg-black">
          <Button
            className="w-full bg-cyberdeus-purple hover:bg-cyberdeus-purple-dark h-12 rounded-md text-sm"
            onClick={handleBuyNft}
            disabled={isLoading || isBought}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                PROCESSING...
              </span>
            ) : (
              isBought ? "NFT PURCHASED" : "BUY NOW"
            )}
          </Button>
        </div>
      ) : (
        <div className="p-4 bg-black">
          <div className="w-full bg-gray-700 h-12 rounded-md flex items-center justify-center text-sm">
            Please connect your wallet
          </div>
        </div>
      )}
    </section>
  );
} 