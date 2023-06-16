'use client'
import React, { useState, useEffect } from 'react';
import {useRouter} from "next/navigation";
import { getStoredWalletPrivateKey } from "@/utils/localstorage";
import WalletPage from "@/components/Wallet";

export default function Page() {
    const router = useRouter();
    const [walletPrivateKey, setWalletPrivateKey] = useState<string | null>(null);

    useEffect(() => {
        if (!getStoredWalletPrivateKey()?.length) {
            router.push('/auth/wallet')
        } else setWalletPrivateKey(getStoredWalletPrivateKey());
    }, [router]);

    return (
        <div>
            {walletPrivateKey?.length &&
                <WalletPage
                    data-testid="wallet-page"
                    walletPrivateKey={walletPrivateKey}
                />
            }
        </div>
    );
}
