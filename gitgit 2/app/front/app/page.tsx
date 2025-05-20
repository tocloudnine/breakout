"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { useConnection } from '@solana/wallet-adapter-react';
import { useProgram } from '@/api/useProgram';
import { Program } from '@coral-xyz/anchor';
import { Cyberdeus } from '@/lib/IDL/cyberdeus';

interface NFTItem {
  mintKey: string;
  imageUrl: string;
  escrowKey: string;
  price: number;
  sellerKey?: string;
  name?: string;
  edition?: number;
  isActive?: boolean;
}

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%231E1E1E'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' text-anchor='middle' fill='white'%3ENFT%3C/text%3E%3C/svg%3E";

export default function MainPage() {
  const [defaultCollectionOpen, setDefaultCollectionOpen] = useState(true);
  const [artCollectionOpen, setArtCollectionOpen] = useState(true);
  const [mintedNFTs, setMintedNFTs] = useState<NFTItem[]>([]);
  
  const { connection } = useConnection();
  const program = useProgram(connection);

  useEffect(() => {
    const loadAllNFTs = async () => {
      // First, load from localStorage
      let localNFTs: Record<string, NFTItem> = {};


      if (program) {
        try {
          const blockchainNFTs = await program.account.escrow.all();
          console.log("Blockchain NFTs:", blockchainNFTs.length);
          
          // Process blockchain NFTs
          blockchainNFTs.forEach(nft => {
            const mintKey = nft.account.nftMint.toBase58();
            const sellerKey = nft.account.seller.toBase58();
            
            // Try to get image from localStorage
            const storedImage = typeof window !== 'undefined' ? 
              localStorage.getItem(`image_${mintKey}`) : null;
            
            // Add to our map
            localNFTs[mintKey] = {
              mintKey,
              escrowKey: nft.publicKey.toString(),
              imageUrl: storedImage || PLACEHOLDER_IMAGE,
              price: +nft.account.price / 10**9,
              sellerKey: sellerKey,
              name: nft.account.name,
              edition: nft.account.edition,
              isActive: nft.account.isActive,
            };
          });
        } catch (e) {
          console.error("Error fetching blockchain NFTs:", e);
        }
      }

      // Convert map to array
      const allNFTs = Object.values(localNFTs);
      console.log("Total NFTs:", allNFTs.length);
      setMintedNFTs(allNFTs);
    };

    loadAllNFTs();
  }, [program]);
  
  return (
    <section className="min-h-screen bg-black text-white">
      {/* Top status bar */}
     
      {/* Main content */}
      <main className="p-6 max-w-md mx-auto">
        <div className="mb-6">
          <h1 className="text-5xl font-light leading-tight tracking-wide">
            CYBERDEUS<br />
            NFT<br />
            PLATFORM
          </h1>

          <div className="flex gap-2 my-4">
            <span className="px-3 py-1 bg-primary text-xs border border-gray-800">BLOCKCHAIN</span>
            <span className="px-3 py-1 bg-primary text-xs border border-gray-800">NFT</span>
            <span className="px-3 py-1 bg-primary text-xs border border-gray-800">ART</span>
          </div>

    
          <div className="mt-8">
            <div className="mb-2">// VISION</div>
            <p className="text-xl font-light">
              A Simplified NFT and royalty distribution solution
            </p>
          </div>
        </div>


        <div className="grid grid-cols-3 gap-2 mb-6">
          <Button className="bg-cyberdeus-purple hover:bg-cyberdeus-purple-dark h-12 rounded-none" asChild>
            <Link href="/">&lt;/&gt;</Link>
          </Button>
          <Button className="bg-cyberdeus-purple hover:bg-cyberdeus-purple-dark h-12 rounded-md" asChild>
            <Link href="/upload">MINT</Link>
          </Button>

        </div>

        {/* Default Collection */}
        <div className="mb-4 border-b border-gray-800 pb-1">
          <button
            className="flex justify-between items-center w-full py-2"
            onClick={() => setDefaultCollectionOpen(!defaultCollectionOpen)}
          >
            <span className="text-lg font-medium">Default Collection ({mintedNFTs.filter(nft => nft.isActive).length})</span>
            <span>{defaultCollectionOpen ? "▼" : "▶"}</span>
          </button>

          {defaultCollectionOpen && (
            <div className="mb-4">
              {/* Vertical Grid Layout */}
              <div className="space-y-4">
                {mintedNFTs.map((nft, index) => (
                  (nft.isActive) &&
                  <div key={nft.mintKey} className="border-b border-gray-800 pb-4 last:border-0">
                    <div className="flex gap-4">
                      <div className="w-28 h-28 bg-[#1E1E1E] relative flex-shrink-0">
                        <Image
                          src={`/images/${nft.name}.jpg`}
                          alt={`NFT ${index}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-between py-1 flex-grow">
                        <div>
                          <div className="font-medium">{nft.name}</div>
                          <div className="text-xs text-gray-400">
                            ID: {nft.mintKey.substring(0, 8)}...
                          </div>
                          <div className="text-xs text-gray-400">
                            Price: {nft.price.toFixed(2)} SOL
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-300">
                            Created: {new Date().toLocaleDateString()}
                          </div>
                          <Link 
                            href={`/buy?mintKey=${nft.mintKey}&escrowKey=${nft.escrowKey}`}
                            className="px-3 py-1 bg-cyberdeus-purple text-white text-xs rounded"
                          >
                            BUY
                          </Link>
                          <Link
                            href={`/merch?mintKey=${nft.mintKey}&escrowKey=${nft.escrowKey}`}
                            className="px-3 mx-1 py-1 bg-cyberdeus-purple-dark text-white text-xs rounded"
                          >
                            MERCH
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mb-4 border-b border-gray-800 pb-1">
          <button
            className="flex justify-between items-center w-full py-2"
            onClick={() => setArtCollectionOpen(!artCollectionOpen)}
          >
            <span className="text-lg font-medium">Art Collection ({mintedNFTs.filter(nft => !nft.isActive).length})</span>
            <span>{artCollectionOpen ? "▼" : "▶"}</span>
          </button>

          {artCollectionOpen && (
            <div className="mb-4">
              {/* Vertical Grid Layout */}  
              <div className="space-y-4">
                {mintedNFTs.map((nft, index) => (
                  (!nft.isActive) &&
                  <div key={nft.mintKey} className="border-b border-gray-800 pb-4 last:border-0">
                    <div className="flex gap-4">
                      <div className="w-28 h-28 bg-[#1E1E1E] relative flex-shrink-0">
                        <Image
                          src={`/images/${nft.name}.jpg`}
                          alt={`NFT ${index}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-between py-1 flex-grow">
                        <div>
                          <div className="font-medium">{nft.name}</div>
                          <div className="text-xs text-gray-400">
                            ID: {nft.mintKey.substring(0, 8)}...
                          </div>
                          <div className="text-xs text-gray-400">
                            Merch Price: {(nft.price * 0.4).toFixed(2)} SOL
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-300">
                            Created: {new Date().toLocaleDateString()}
                          </div>

                          <Link
                            href={`/merch?mintKey=${nft.mintKey}&escrowKey=${nft.escrowKey}`}
                            className="px-3 mx-1 py-1 bg-cyberdeus-purple-dark text-white text-xs rounded"
                          >
                            MERCH
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>    
            </div>
          )}
        </div>
      </main>


    </section>
  );
}
