"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUpload } from "@/lib/context/upload-context";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { useProgram } from "@/api/useProgram";
import { createMint } from "@solana/spl-token";
import { createNft, createEscrow} from "@/lib/index"
import { toast } from "sonner";

import { manualSendTransactionV0 } from "@/lib/send"

export default function ReviewPage() {
  const router = useRouter();
  const { filePreview, metadata, file } = useUpload();
  const [isMinting, setIsMinting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [cachedImage, setCachedImage] = useState<string | null>(null);
  const [mintKey, setMintKey] = useState<string | null>(null);

  const { connection } = useConnection()
  const { publicKey, signTransaction } = useWallet();
  const program = useProgram(connection);
  
  // Load image from local storage or save current image
  useEffect(() => {
    // Try to load from localStorage first
    const storedMintKeys = localStorage.getItem('mintKeys');
    let mintKeyArray: string[] = [];
    
    if (storedMintKeys) {
      try {
        mintKeyArray = JSON.parse(storedMintKeys);
        // Use the latest mint key if available
        if (mintKeyArray.length > 0) {
          const latestMintKey = mintKeyArray[mintKeyArray.length - 1];
          setMintKey(latestMintKey);
          
          const storedImage = localStorage.getItem(`image_${latestMintKey}`);
          if (storedImage) {
            setCachedImage(storedImage);
          }
        }
      } catch (e) {
        console.error("Error parsing mint keys", e);
      }
    }
    
    // If there's a filePreview and mint key, save it to localStorage
    if (filePreview && mintKey) {
      localStorage.setItem(`image_${mintKey}`, filePreview);
    }
  }, [filePreview, mintKey]);
  
  const mintNFT = async () => {
    setIsMinting(true);
    if (!program) {
      console.log("Program not found");
      toast.error("Program not found");
      return;
    }
    if (!publicKey || !signTransaction) {
      console.log("Wallet not connected");
      toast.error("Wallet not connected");
      return;
    } 
    if (!metadata.price) {
        console.log("Price is not set");
        toast.error("Price is not set");
        return;
    }
    const nft = Keypair.generate();
    const nftPublicKey = nft.publicKey.toString();
    setMintKey(nftPublicKey);
    

    
    const nftTx = await createNft(program, publicKey, nft.publicKey, metadata.title, metadata.title.toLowerCase().slice(0, 4), "https://arweave.net/")
    const escrowTokenTx = await createEscrow(program, publicKey, nft.publicKey, +metadata.price * 10**9, metadata.title, metadata.edition, metadata.physicalMerchandisingPercentage, metadata.digitalResellPercentage)

    console.log(nftTx, escrowTokenTx)

    await manualSendTransactionV0([...nftTx, ...escrowTokenTx], publicKey, connection, signTransaction, toast, [nft])
    if (filePreview) {
      localStorage.setItem(`image_${nftPublicKey}`, filePreview);

      // Store the mint key in an array for retrieval later
      const existingKeys = localStorage.getItem('mintKeys');
      let mintKeys = [];

      if (existingKeys) {
        try {
          mintKeys = JSON.parse(existingKeys);
        } catch (e) {
          console.error("Error parsing mint keys", e);
        }
      }

      mintKeys.push(nftPublicKey);
      localStorage.setItem('mintKeys', JSON.stringify(mintKeys));
    }
    setIsComplete(true)
    setIsMinting(false)
  } 

  // Use cached image if filePreview is not available
  const displayImage = filePreview || cachedImage;

  if (typeof window !== 'undefined' && !displayImage) {
    router.push('/upload');
    return null;
  }

  return (
    <section className="bg-black text-white max-w-md mx-auto flex flex-col h-full">
      <div className="flex-1 p-4">
        <h2 className="text-3xl font-light mb-3">Review</h2>
        
        <div className="flex justify-between mb-2">
          <div className="flex gap-1">
            <div className="w-2 h-1 bg-gray-500"></div>
            <div className="w-2 h-1 bg-gray-500"></div>
            <div className="w-8 h-1 bg-white"></div>
          </div>
          <div className="text-xs">STEP 3/3</div>
        </div>
        
        {/* Preview */}
        <div className="mb-6">
          <div className="w-full mb-4">
            {displayImage && (
              <Image
                src={displayImage}
                alt="Uploaded image"
                width={400}
                height={400}
                className="w-full aspect-square object-contain bg-[#1E1E1E]"
              />
            )}
          </div>
          
          <div className="bg-[#1E1E1E] p-4 space-y-3">
            <div>
              <div className="text-gray-400 text-xs">Title</div>
              <div className="text-white">{metadata.title || "Untitled"}</div>
            </div>
            
            <div>
              <div className="text-gray-400 text-xs">Caption</div>
              <div className="text-white">{metadata.caption || "No caption"}</div>
            </div>
            
            <div>
              <div className="text-gray-400 text-xs">Price</div>
              <div className="text-white">{metadata.price || "0"} SOL</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-400 text-xs">Digital Resell</div>
                <div className="text-white">{metadata.digitalResellPercentage / 100}%</div>
              </div>
              
              <div>
                <div className="text-gray-400 text-xs">Physical Merchandising</div>
                <div className="text-white">{metadata.physicalMerchandisingPercentage / 100}%</div>
              </div>
            </div>
            
            <div>
              <div className="text-gray-400 text-xs">File</div>
              <div className="text-white text-xs truncate">{file?.name}</div>
            </div>
          </div>
        </div>
        
        {isComplete && (
          <div className="bg-green-900/20 p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle2 className="text-green-500 mr-2 h-5 w-5" />
              <div>
                <div className="text-green-500 font-semibold">Successfully minted!</div>
                <div className="text-xs text-green-500/80">Your NFT has been minted to the blockchain</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer with Mint button */}
      {(program && publicKey && signTransaction) ? (
        <div className="p-4 bg-black">
          <Button 
          className={cn(
            "w-full bg-cyberdeus-purple hover:bg-cyberdeus-purple h-12 rounded-md text-sm",
            (isMinting || isComplete) && "opacity-50"
          )}
          onClick={mintNFT}
          disabled={isMinting || isComplete}
        >
          {isMinting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              MINTING...
            </span>
          ) : isComplete ? (
            "MINTED"
          ) : (
            "MINT NOW"
          )}
        </Button>
      </div>
      ):(
        <div className="p-4 bg-black">
          <div className="text-gray-400 text-xs">Loading...</div>
        </div>
      )}
    </section>
  );
} 