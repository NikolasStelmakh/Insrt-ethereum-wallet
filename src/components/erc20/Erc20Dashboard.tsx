import React, { useState, useEffect } from 'react';
import {getStoredEthErc20ContractAddress} from "@/utils/localstorage";
import ContractLogin from "@/components/forms/ContractLogin";
import ErcTransfer from "@/components/erc20/ErcTransfer";
import {WalletInstance} from "@/utils/ethers";

export default function Erc20Dashboard({
    walletAddress,
    walletPrivateKey,
    walletInstance,
}: {
    walletAddress: string;
    walletPrivateKey: string;
    walletInstance: WalletInstance;
}) {
    const [contractAddress, setContractAddress] = useState<string | null>(null);

    useEffect(() => {
        setContractAddress(getStoredEthErc20ContractAddress());
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mt-4 text-gray-800 dark:text-white flex justify-center">ERC-20 Section</h1>
            {(contractAddress === '') && <ContractLogin setContractAddress={setContractAddress} />}
            {contractAddress?.length &&
                <ErcTransfer
                    walletInstance={walletInstance}
                    walletPrivateKey={walletPrivateKey}
                    walletAddress={walletAddress}
                    setContractAddress={setContractAddress}
                    contractAddress={contractAddress}
                />
            }
        </div>
    );
}
