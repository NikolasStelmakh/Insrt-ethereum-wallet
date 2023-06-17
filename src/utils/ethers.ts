import {privateToAddress, toChecksumAddress} from "ethereumjs-util";
import {ethers, InfuraProvider, Wallet} from "ethers";
import {evaluate} from 'mathjs'
import {ethereumPrivateKeyValidator} from "@/utils/validators";

const INFURA_API_KEY = process.env.INFURA_API_KEY || 'b754d988619541978228c7b6921576bd';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || 'HAJKRQURWBDPHYYR4FUM3EF6U3NWKT4A4S';
export const NETWORK_NAME = process.env.ETHERSCAN_API_KEY || 'goerli';

export const getContractABI = async (contractAddress: string): Promise<any | null> => {
    try {
        const apiUrl = `https://${NETWORK_NAME === 'goerli' ? 'api-goerli' : 'api'}.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${ETHERSCAN_API_KEY}`;

        const response = await fetch(apiUrl);
        const responseData = await response.json();
        const { status, message, result } = responseData;

        if (status === '1') {
            // ABI successfully retrieved
            return  JSON.parse(result);
        } else {
            console.error('Failed to retrieve contract ABI:', message);
            return null;
        }
    } catch (error) {
        console.error('Error retrieving contract ABI:', error);
        return null;
    }
}

export const createContractInstance = (
    contractAddress: string,
    abi: any,
    privateKey: string,
): ethers.Contract | null => {
    try {
        const provider = new ethers.InfuraProvider(NETWORK_NAME, INFURA_API_KEY)
        const signer = new ethers.Wallet(privateKey, provider);
        return new ethers.Contract(contractAddress, abi, signer);
    } catch (error) {
        console.error('Error creating contract instance:', error);
        return null;
    }
};

export const getDecimalFactorOfTheContract = async (contractInstance: ethers.Contract): Promise<string> => {
    try {
        return (await contractInstance.decimals()).toString();
    } catch (error) {
        console.error('Error retrieving decimal factor:', error);
        return '0'; // Default to 0 if there's an error
    }
};

export const convertNativeToETH = (balance: string, decimalFactor: string): string => {
    return evaluate(`${balance} / 10 ^ ${decimalFactor}`)
};

export const convertETHToNative = (ethAmount: string, decimalFactor: string): string => {
    return evaluate(`${ethAmount} * 10 ^ ${decimalFactor}`)
};

export class WalletInstance {
    private readonly privateKey: string;
    public readonly provider: InfuraProvider;
    public readonly signer: Wallet;
    public balance: string | null; // ETH
    public address: string;
    constructor(privateKey: string) {
        if (ethereumPrivateKeyValidator(privateKey)) {
            this.privateKey = privateKey;
            this.balance = null;
            this.provider = new ethers.InfuraProvider(NETWORK_NAME, INFURA_API_KEY);
            this.signer = new ethers.Wallet(privateKey, this.provider);
            this.address = this.getAddress();
        } else throw new Error('Wallet initialization: Private key validation error.')
    }

    public async getBalance(): Promise<string | null> {
        try {
            const address = await this.signer.getAddress();
            const balance = await this.provider.getBalance(address);

            // WEI to ETH
            const balanceInETH = ethers.formatEther(balance)

            this.balance = balanceInETH;
            return balanceInETH;
        } catch (error) {
            console.error('Failed to get ETH balance', error);
            return null;
        }
    };

    public getAddress(): string {
        try {
            const privateKeyBuffer = Buffer.from(this.privateKey, 'hex')
            const address: Buffer = privateToAddress(privateKeyBuffer)
            const publicAddress: string = toChecksumAddress('0x' + address.toString('hex'));
            this.address = publicAddress;
            return publicAddress;
        } catch (error) {
            console.error('Error deriving address from private key:', error);
            return '';
        }
    };

    public async sendTokensWithContract({
        contractInstance,
        tokenDecimalFactor,
        toAddress,
        amount,
        setProgress,
    } : {
        contractInstance: ethers.Contract,
        setProgress: (value: {message: string, link?: string, isSuccess?: boolean, isError?: boolean} | null) => void,
        tokenDecimalFactor: string,
        toAddress: string,
        amount: string
    }):  Promise<void> {
        try {
            const nativeAmount = ethers.parseUnits(amount, Number(tokenDecimalFactor));
            const contractSigner = contractInstance.connect(this.signer)

            // @ts-ignore
            const tx = await contractSigner.transfer(toAddress, nativeAmount);

            setProgress({
                message: 'Mining transaction...',
                link: `https://${NETWORK_NAME}.etherscan.io/tx/${tx.hash}`,
            });
            console.log("Mining transaction...");
            console.log(`https://${NETWORK_NAME}.etherscan.io/tx/${tx.hash}`);

            // Waiting for the transaction to be mined
            const receipt = await tx.wait();
            // The transaction is now on chain!
            setProgress({
                message: `Mined in block ${receipt.blockNumber}`,
                link: `https://${NETWORK_NAME}.etherscan.io/tx/${tx.hash}`,
                isSuccess: true,
            })
            console.log(`Mined in block ${receipt.blockNumber}`);
        } catch (error) {
            console.error('Error sending tokens:', error);
            setProgress({
                message: 'Error sending tokens: ' + JSON.stringify(error, null, 2),
                isError: true
            });
        }
    }
}
