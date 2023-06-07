import {ethereumPrivateKeyValidator} from "@/utils/ethers";

export const STORED_KEY_NAME = 'ethPrivateKey'
export const getStoredEthPrivateKey = (() => {
    if (typeof window !== 'undefined') {
        const storedItem = localStorage.getItem(STORED_KEY_NAME);
        if (storedItem) {
            if (ethereumPrivateKeyValidator(storedItem)) return storedItem
            localStorage.removeItem(STORED_KEY_NAME)
            return ''
        }
        return ''
    }
    return ''
});
