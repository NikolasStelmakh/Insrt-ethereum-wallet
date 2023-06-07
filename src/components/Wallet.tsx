import React, { useEffect, useState } from "react";
import { exportPublicKeyFromPrivate, getEthBalance } from "@/utils/ethers";
import { STORED_KEY_NAME } from "@/utils/localstorage";

export default function WalletPage({
                                       ethPrivateKey,
                                       setEthPrivateKey
                                   }: {
    ethPrivateKey: string | null;
    setEthPrivateKey: (val: string | null) => void;
}) {
    const [ethPublicKey, setEthPublicKey] = useState<string | null>(null);
    const [walletBalance, setWalletBalance] = useState<string | null>(null);
    const [copyNotification, setCopyNotification] = useState<boolean>(false);

    useEffect(() => {
        setEthPublicKey(ethPrivateKey ? exportPublicKeyFromPrivate(ethPrivateKey) : null);

        const getBalance = async () => {
            if (ethPrivateKey) {
                const balance = await getEthBalance(ethPrivateKey);
                setWalletBalance(balance);
            }
        };

        if (ethPrivateKey?.length) {
            getBalance();
        } else {
            setWalletBalance(null);
        }
    }, [ethPrivateKey]);

    const copyToClipboard = () => {
        if (ethPublicKey) {
            navigator.clipboard.writeText(ethPublicKey);
            setCopyNotification(true);
            setTimeout(() => {
                setCopyNotification(false);
            }, 2000);
        }
    };

    const clearPrivateKey = () => {
        setEthPrivateKey("");
        localStorage.removeItem(STORED_KEY_NAME);
    };

    return (
        <div className="bg-gray-200 dark:bg-gray-800 shadow p-6 relative">
            <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Your ETH Wallet</h1>
            <p className="text-green-500 mt-4 flex">
                <span className="font-semibold text-gray-800 dark:text-white mr-1">ETH Public Key:</span>
                <span className="truncate block cursor-pointer" onClick={copyToClipboard}>
          {ethPublicKey}
        </span>
            </p>
            {copyNotification && (
                <p className="text-sm text-gray-500 absolute top-14 left-1/4">Copied to clipboard!</p>
            )}
            <p className="text-green-500 mt-4 flex">
                <span className="font-semibold text-gray-800 dark:text-white mr-1">Balance:</span>
                <span>{walletBalance ? `${walletBalance} ETH` : <span className="animate-pulse">Loading...</span>}</span>
            </p>
            <button
                onClick={clearPrivateKey}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded font-semibold mt-4"
            >
                Logout
            </button>
        </div>
    );
}
