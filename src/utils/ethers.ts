import {isValidPrivate, isValidAddress, privateToAddress, toChecksumAddress} from "ethereumjs-util";
import {ethers} from "ethers";
import {evaluate} from 'mathjs'

const INFURA_API_KEY = process.env.INFURA_API_KEY || 'b754d988619541978228c7b6921576bd';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || 'HAJKRQURWBDPHYYR4FUM3EF6U3NWKT4A4S';
export const NETWORK_NAME = process.env.ETHERSCAN_API_KEY || 'goerli'

export const ethereumPrivateKeyValidator = (value: string): boolean => {
    try {
        return isValidPrivate(Buffer.from(value, 'hex'));
    } catch (error) {
        return false;
    }
};

export const ethereumAddressValidator = (value: string): boolean => {
    try {
        return isValidAddress(value);
    } catch (error) {
        return false;
    }
};

export const getAddressFromPrivateKey = (privateKey: string): string | null => {
    try {
        const privateKeyBuffer = Buffer.from(privateKey, 'hex')
        const address: Buffer = privateToAddress(privateKeyBuffer)
        return toChecksumAddress('0x' + address.toString('hex'))
    } catch (error) {
        console.error('Error deriving address from private key:', error);
        return null;
    }
};

export const getEthBalance = async (privateKey: string): Promise<string | null> => {
    try {
        const provider = new ethers.InfuraProvider(NETWORK_NAME, INFURA_API_KEY)
        const wallet = new ethers.Wallet(privateKey, provider);
        const address = await wallet.getAddress();
        const balance = await provider.getBalance(address);

        // WEI to ETH
        return ethers.formatEther(balance);
    } catch (error) {
        console.error('Failed to get ETH balance', error);
        return null;
    }
};

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

