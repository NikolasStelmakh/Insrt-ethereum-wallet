import React, { useEffect, useState } from "react";
import {getAddressFromPrivateKey, getEthBalance, NETWORK_NAME} from "@/utils/ethers";
import { STORED_ETH_PRIVATE_KEY_NAME } from "@/utils/localstorage";
import Erc20Dashboard from "@/components/erc20/Erc20Dashboard";

export default function WalletPage({
    walletPrivateKey,
    setEthPrivateKey
}: {
    walletPrivateKey: string;
    setEthPrivateKey: (val: string | null) => void;
}) {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [walletBalance, setWalletBalance] = useState<string | null>(null);
    const [isCopyNotificationVisible, setIsCopyNotificationVisible] = useState<boolean>(false);

    useEffect(() => {
        setWalletAddress(walletPrivateKey ? getAddressFromPrivateKey(walletPrivateKey) : null);

        const getBalance = async () => {
            if (walletPrivateKey) {
                const balance = await getEthBalance(walletPrivateKey);
                setWalletBalance(balance);
            }
        };

        if (walletPrivateKey?.length) {
            getBalance();
        } else {
            setWalletBalance(null);
        }
    }, [walletPrivateKey]);

    const copyToClipboard = () => {
        if (walletAddress) {
            navigator.clipboard.writeText(walletAddress);
            setIsCopyNotificationVisible(true);
            setTimeout(() => {
                setIsCopyNotificationVisible(false);
            }, 2000);
        }
    };

    const clearPrivateKey = () => {
        setEthPrivateKey("");
        localStorage.removeItem(STORED_ETH_PRIVATE_KEY_NAME);
    };

    return (
        <div className="shadow p-6 relative" data-testid="wallet-dashboard-container">
            <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Your ETH Wallet</h1>
            <p className="text-green-500 mt-4 flex">
                <span className="font-semibold text-gray-800 dark:text-white mr-1">Network:</span>
                <span>{NETWORK_NAME}</span>
            </p>
            <p className="text-green-500 mt-4 flex">
                <span className="font-semibold text-gray-800 dark:text-white mr-1">Wallet Address:</span>
                <span className="truncate block cursor-pointer" onClick={copyToClipboard}>{walletAddress}</span>
            </p>
            {isCopyNotificationVisible && (
                <p className="text-sm text-gray-500 absolute top-24">Copied to clipboard!</p>
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

            {walletAddress && <Erc20Dashboard walletPrivateKey={walletPrivateKey} walletAddress={walletAddress}/>}
        </div>
    );
}
