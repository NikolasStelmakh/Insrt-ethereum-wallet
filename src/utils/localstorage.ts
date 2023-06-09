import {ethereumAddressValidator, ethereumPrivateKeyValidator} from "@/utils/ethers";

export const STORED_ETH_PRIVATE_KEY_NAME = 'ethPrivateKey'

export const STORED_ETH_ERC20_ADDRESS = 'ethErc20Address'

const getStoredItem = (keyName: string, validator: (value: string) => boolean) => {
    if (typeof window !== 'undefined') {
        const storedItem = localStorage.getItem(keyName);
        if (storedItem) {
            if (validator(storedItem)) return storedItem
            localStorage.removeItem(keyName)
            return ''
        }
        return ''
    }
    return ''
}

export const getStoredEthPrivateKey = (() => {
    return getStoredItem(STORED_ETH_PRIVATE_KEY_NAME, ethereumPrivateKeyValidator);
});

export const getStoredEthErc20Address = (() => {
    return getStoredItem(STORED_ETH_ERC20_ADDRESS, ethereumAddressValidator)
});
