'use client'
import React, { useState, useEffect } from 'react';
import { getStoredEthPrivateKey } from "@/utils/localstorage";
import LoginPage from "@/components/forms/WalletLogin";
import WalletPage from "@/components/Wallet";

export default function Page() {
    const [ethPrivateKey, setEthPrivateKey] = useState<string | null>(null);

    useEffect(() => {
        setEthPrivateKey(getStoredEthPrivateKey());
    }, []);

    return (
        <div>
            {(ethPrivateKey === '') && <LoginPage data-testid="login-page" setEthPrivateKey={setEthPrivateKey} />}
            {ethPrivateKey?.length && <WalletPage data-testid="wallet-page" setEthPrivateKey={setEthPrivateKey} walletPrivateKey={ethPrivateKey} />}
        </div>
    );
}
