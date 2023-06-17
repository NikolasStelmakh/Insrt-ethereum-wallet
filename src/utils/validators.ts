import {isValidAddress, isValidPrivate} from "ethereumjs-util";
import {evaluate} from "mathjs";

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

export const tokensAmountValidator = (maxValue: string) => (value: string): boolean => {
    try {
        return evaluate(`${maxValue} >= ${value}`) && evaluate(`${value} > 0`)
    } catch (error) {
        return false;
    }
};

export const transferAddressValidator = (excludedValues: string[]) => (value: string): boolean => {
    try {
        return !excludedValues.includes(value) && ethereumAddressValidator(value)
    } catch (error) {
        return false;
    }
};
