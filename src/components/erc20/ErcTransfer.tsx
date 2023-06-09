import React, { useEffect, useState } from "react";
import {
    getContractABI,
    createContractInstance,
    convertNativeToETH,
    getDecimalFactorOfTheContract
} from "@/utils/ethers";
import {STORED_ETH_ERC20_ADDRESS} from "@/utils/localstorage";
import {ethers} from "ethers";
import SendERC20Tokens from "@/components/forms/SendERC20Tokens";

export default function ErcTransfer({
    walletPrivateKey,
    walletAddress,
    contractAddress,
    setContractAddress
}: {
    walletPrivateKey: string;
    walletAddress: string;
    contractAddress: string;
    setContractAddress: (val: string | null) => void;
}) {
    const [error, setError] = useState<string | null>(null);
    const [isCopyNotificationVisible, setIsCopyNotificationVisible] = useState<boolean>(false);
    // todo: refactor by useRef or interface
    const [contractInstance, setContractInstance] = useState<ethers.Contract | null>(null);
    const [tokensBalance, setTokensBalance] = useState<string | null>(null);
    const [tokenDecimalFactor, setTokenDecimalFactor] = useState<string | null>(null);
    const [tokenSymbol, setTokenSymbol] = useState<string | null>(null);

    useEffect(() => {
        const initializeContractInstance = async () => {
            try {
                if (contractAddress) {
                    const abi = await getContractABI(contractAddress);
                    if (abi) {
                        const contractInstance = await createContractInstance(contractAddress, abi, walletPrivateKey);
                        if (contractInstance) {
                            try {
                                const balance = (await contractInstance.balanceOf(walletAddress)).toString();
                                const decimalFactor = await getDecimalFactorOfTheContract(contractInstance);
                                const tokenSymbol = await contractInstance.symbol();
                                setTokenDecimalFactor(decimalFactor);
                                setTokenSymbol(tokenSymbol);
                                setTokensBalance(balance);
                                setContractInstance(contractInstance);
                                setError(null)
                            } catch (e) {
                                setError('Cannot get ERC-20 tokens balance: ' + JSON.stringify(e, null, 2))
                                console.error('Error retrieving erc20 balance:', e);
                            }
                        } else setError('Incorrect contract, cannot create ContractInstance.')
                    } else {
                        setError('Incorrect contract, cannot get ABI.')
                    }
                }
            } catch (error) {
                console.error('Error initializing contract instance:', error);
            }
        };

        if (contractAddress?.length) {
            initializeContractInstance();
        } else {
            setTokensBalance(null);
            setContractInstance(null);
        }
    }, [contractAddress, walletPrivateKey, walletAddress]);

    const clearContractAddress = () => {
        setContractAddress("");
        localStorage.removeItem(STORED_ETH_ERC20_ADDRESS);
    };

    const copyToClipboard = () => {
        if (contractAddress) {
            navigator.clipboard.writeText(contractAddress);
            setIsCopyNotificationVisible(true);
            setTimeout(() => {
                setIsCopyNotificationVisible(false);
            }, 2000);
        }
    };

    return (
        <div className="shadow p-6 relative">
            <p className="text-green-500 mt-4 flex">
                <span className="font-semibold text-gray-800 dark:text-white mr-1">Contract Address:</span>
                <span className="truncate block cursor-pointer" onClick={copyToClipboard}>{contractAddress}</span>
            </p>
            {isCopyNotificationVisible && (
                <p className="text-sm text-gray-500 absolute top-5">Copied to clipboard!</p>
            )}
            {!error && <p className="text-green-500 mt-4 flex">
                <span className="font-semibold text-gray-800 dark:text-white mr-1">Balance:</span>
                <span>{(tokensBalance && tokenDecimalFactor) ? `${convertNativeToETH(tokensBalance, tokenDecimalFactor)} ${tokenSymbol}` :
                    <span className="animate-pulse">Loading...</span>}</span>
            </p>}
            <button
                onClick={clearContractAddress}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded font-semibold mt-4"
            >
                Clear
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}

            {!error && tokensBalance && contractInstance && tokenDecimalFactor && tokenSymbol && <div>
                <SendERC20Tokens
                    walletPrivateKey={walletPrivateKey}
                    contractInstance={contractInstance}
                    balance={tokensBalance}
                    tokenDecimalFactor={tokenDecimalFactor}
                    tokenSymbol={tokenSymbol}
                    contractAddress={contractAddress}
                    walletAddress={walletAddress}
                    setTokensBalance={setTokensBalance}
                />
            </div>}
        </div>
    );
}
