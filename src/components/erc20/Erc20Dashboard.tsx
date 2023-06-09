import React, { useState, useEffect } from 'react';
import {getStoredEthErc20Address} from "@/utils/localstorage";
import ContractLogin from "@/components/forms/ContractLogin";
import ErcTransfer from "@/components/erc20/ErcTransfer";

export default function Erc20Dashboard({walletAddress, walletPrivateKey}: {walletAddress: string, walletPrivateKey: string}) {
    const [contractAddress, setContractAddress] = useState<string | null>(null);

    useEffect(() => {
        setContractAddress(getStoredEthErc20Address());
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mt-4 text-gray-800 dark:text-white flex justify-center">ERC-20 Section</h1>
            {(contractAddress === '') && <ContractLogin setContractAddress={setContractAddress} />}
            {contractAddress?.length &&
                <ErcTransfer
                    walletPrivateKey={walletPrivateKey}
                    walletAddress={walletAddress}
                    setContractAddress={setContractAddress}
                    contractAddress={contractAddress}
                />
            }
        </div>
    );
}
