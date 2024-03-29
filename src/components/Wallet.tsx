import React, { useEffect, useState } from "react";
import {useRouter} from "next/navigation";
import {NETWORK_NAME, WalletInstance} from "@/utils/ethers";
import { STORED_ETH_WALLET_PRIVATE_KEY_NAME } from "@/utils/localstorage";
import Erc20Dashboard from "@/components/erc20/Erc20Dashboard";

export default function WalletPage({
    walletPrivateKey,
}: {
    walletPrivateKey: string;
}) {
    const router = useRouter();

    const [walletInstance, setWalletInstance] = useState<WalletInstance | null>(null);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [walletBalance, setWalletBalance] = useState<string | null>(null);
    const [isCopyNotificationVisible, setIsCopyNotificationVisible] = useState<boolean>(false);

    useEffect(() => {
        const getWalletData = async () => {
            try {
                const wallet = new WalletInstance(walletPrivateKey);
                setWalletInstance(wallet);
                setWalletAddress(wallet.getAddress());
                const balance = await wallet.getBalance();
                setWalletBalance(balance);
            } catch (e) {
                console.log('Error while getting wallet data: ', JSON.stringify(e, null, 2));
            }
        };

        if (walletPrivateKey?.length) {
            getWalletData();
        } else {
            setWalletBalance(null);
            setWalletInstance(null);
            setWalletAddress(null);
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
        localStorage.removeItem(STORED_ETH_WALLET_PRIVATE_KEY_NAME);
        router.push('/auth/wallet');
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
            <p className="text-green-500 mt-4 flex">
                <span className="font-semibold text-gray-800 dark:text-white mr-1">Transactions history:</span>
                <span>
                    <a
                        href={`https://${NETWORK_NAME}.etherscan.io/address/${walletAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline block truncate"
                    >
                        {`https://${NETWORK_NAME}.etherscan.io/address/${walletAddress}`}
                    </a>
                </span>
            </p>
            <button
                onClick={clearPrivateKey}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded font-semibold mt-4"
            >
                Logout
            </button>

            {walletAddress && walletInstance &&
                <Erc20Dashboard
                    walletPrivateKey={walletPrivateKey}
                    walletAddress={walletAddress}
                    walletInstance={walletInstance}
                />
            }
        </div>
    );
}
