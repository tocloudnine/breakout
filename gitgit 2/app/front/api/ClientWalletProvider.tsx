"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

const WalletContext = dynamic(() => import('@/api/WalletContext'), {
  ssr: false,
});

export default function ClientWalletProvider({ children }: { children: ReactNode }) {
  return <WalletContext>{children}</WalletContext>;
} 