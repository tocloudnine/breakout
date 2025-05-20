"use client";

import { Button } from "./ui/button";
import { ChevronLeft, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal, WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function MobileHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { publicKey } = useWallet();

  const getTitle = () => {
    return 'Cyberdeus';
  };

  const title = getTitle();

  // Handle back button click
  const handleBack = () => {
    router.push('/');
  };
  const { setVisible } = useWalletModal()
  return (
    <div className="w-full">
      {/* Wallet Card */}
      <div className="flex flex-col items-start p-3 gap-3 w-full h-[105px] bg-[rgba(15,1,50,0.6)] backdrop-blur-[10px]">
        <div className="flex flex-row items-start gap-2.5 w-full h-9">
          {pathname !== '/' && (
            <div onClick={handleBack} className="flex flex-row justify-center items-center p-3 w-9 h-9 bg-[rgba(114,91,218,0.2)]">
              <span
                className="text-xs font-bold tracking-wide text-[#CFCFCF] cursor-pointer"
             
              >
                &lt;
              </span>
            </div>
          )}
          <div className="flex flex-row items-center px-2 gap-2.5 h-9 bg-[#725BDA] flex-grow">
            <span className="text-sm tracking-wide text-black font-black italic">{title}</span>
          </div>
        </div>

        {/* Wallet section row */}
        <div className="flex flex-row justify-between items-center gap-[5px] w-full h-[18px]">
          {publicKey ? (
            <div className="flex flex-row items-center gap-[5px] w-full h-[18px]">
              <div className="flex flex-row justify-center items-center h-[18px] bg-[#725BDA] flex-grow">
                <span className="text-xs font-bold tracking-wide text-black">WALLET {publicKey.toString().slice(0, 4) + "..." + publicKey.toString().slice(-4)}</span>
              </div>
              <div className="flex justify-center items-center w-[6px] h-[18px] bg-[#725BDA]"></div>
              <div className="flex justify-center items-center w-[6px] h-[18px] bg-[#725BDA]"></div>
              <div className="flex justify-center items-center w-[6px] h-[18px] bg-[#725BDA]"></div>
              <div className="flex justify-center items-center w-[15px] h-[18px] bg-[#725BDA]">
                <span className="text-xs font-bold tracking-wide text-black">+</span>
              </div>
            </div>
          ) : (
            <div className="bg-[#725BDA] w-full flex justify-center items-center h-[18px]">
              <button 
                className="w-full text-xs font-bold tracking-wide text-black"
                onClick={() => setVisible(true)}
              >
                CONNECT WALLET
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-row items-start gap-2.5">
          <span className="text-[0.5rem] uppercase tracking-wide text-[#6238C2]">CYBERDEUS WALLET [V 1.01]</span>
          <span className="text-[0.5rem] uppercase tracking-wide text-[#6238C2]">STATUS: NORMAL</span>
        </div>
      </div>
    </div>
  );
} 