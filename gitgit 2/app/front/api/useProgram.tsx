import { AnchorProvider, Program, Wallet, workspace } from '@coral-xyz/anchor'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'

import { Cyberdeus, IDL } from '@/lib/IDL/cyberdeus'
import { CYBERDEUS_PROGRAM_ID } from '@/lib/constants'


export function useProgram(connection?: Connection) {
    const mock_key = Keypair.generate();
    const wallet = {
        publicKey: mock_key.publicKey,
        signTransaction: undefined,
        signAllTransactions: undefined
    };

    return useMemo(() => {
        console.log("connection", connection)
        if (!connection) return undefined
        // @ts-ignore
        const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions())

        return new Program<Cyberdeus>(IDL, CYBERDEUS_PROGRAM_ID, provider)
    }, [connection])
}

