import {isValidPrivate, privateToPublic} from "ethereumjs-util";
import {ethers} from "ethers";

export const ethereumPrivateKeyValidator = (value: string): boolean => {
    try {
        return isValidPrivate(Buffer.from(value, 'hex'));
    } catch (error) {
        return false;
    }
};

export const exportPublicKeyFromPrivate = (ethPrivateKey: string): string|null => {
    try {
        return privateToPublic(Buffer.from(ethPrivateKey, 'hex')).toString('hex')
    } catch (error) {
        return null;
    }
};

export const getEthBalance = async (privateKey: string, network = 'goerli'): Promise<string> => {
    try {
        const provider = ethers.getDefaultProvider(network, {
            // etherscan: process.env.ETHERSCAN_API_KEY || 'HAJKRQURWBDPHYYR4FUM3EF6U3NWKT4A4S'
        });
        const wallet = new ethers.Wallet(privateKey, provider);
        const address = await wallet.getAddress();
        const balance = await provider.getBalance(address);

        // WEI to ETH
        return ethers.formatEther(balance);
    } catch (error) {
        console.error(error);
        throw new Error('Failed to get ETH balance');
    }
};
