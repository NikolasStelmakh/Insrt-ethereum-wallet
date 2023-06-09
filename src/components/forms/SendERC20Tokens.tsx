import {useForm} from "react-hook-form";
import React, {ChangeEvent, useState} from "react";
import {ethers} from "ethers";
import {convertNativeToETH, getAddressFromPrivateKey, sendTokens} from "@/utils/ethers";
import {transferAddressValidator, tokensAmountValidator} from "@/utils/validators";

interface SendFormData {
    toAddress: string;
    amount: string;
}

export default function SendERC20Tokens ({
    walletPrivateKey,
    contractInstance,
    balance,
    tokenDecimalFactor,
    tokenSymbol,
    contractAddress,
    walletAddress,
    setTokensBalance,
} : {
    walletPrivateKey: string,
    contractInstance: ethers.Contract,
    balance: string,
    tokenDecimalFactor: string,
    tokenSymbol: string,
    contractAddress: string,
    walletAddress: string,
    setTokensBalance: (value: string | null) => void,
}) {
    const [progress, setProgress] = useState<{message: string, link?: string}|null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted },
        setValue,
        resetField,
    } = useForm<SendFormData>({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });
    const handleChangeAddress = (event: ChangeEvent<HTMLInputElement>) => {
        if (progress) setProgress(null);
        const value = event.target.value;
        setValue('toAddress', value.trim(), { shouldValidate: isSubmitted }); // Update the form value
    };

    const handleChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
        if (progress) setProgress(null);
        const value = event.target.value;
        setValue('amount', value.trim(), { shouldValidate: isSubmitted }); // Update the form value
    };

    const onSubmitLogin = async (data: SendFormData) => {
        try {
            setIsLoading(true);
            await sendTokens({
                contractInstance,
                setProgress,
                tokenDecimalFactor,
                privateKey: walletPrivateKey,
                toAddress: data.toAddress,
                amount: data.amount
            })
            resetField('amount');
            setTokensBalance((await contractInstance.balanceOf(walletAddress)).toString());
        } catch (e) {
            console.log('Error sending tokens: ' + JSON.stringify(e, null, 2));
            setProgress({message: 'Error sending tokens: ' + JSON.stringify(e, null, 2)});
        }

        setIsLoading(false);
    };

    return (
        <div className="flex justify-center">
            <div className="max-w-xl w-full shadow rounded-lg p-8 space-y-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex justify-center">Send Tokens</h1>
                <form onSubmit={handleSubmit(onSubmitLogin)} className="space-y-4">
                    <div className="mb-4">
                        <label htmlFor="toAddress" className="block font-semibold text-gray-800 dark:text-white">
                            Address:
                        </label>
                        <input
                            type="text"
                            id="toAddress"
                            className={
                                `border rounded px-4 py-3 ${errors.toAddress ? 'border-red-500' : 'border-gray-300'
                                } text-gray-800 dark:text-white bg-transparent dark:bg-transparent w-full`
                            }
                            {...register('toAddress', {
                                required: true,
                                validate: transferAddressValidator([getAddressFromPrivateKey(walletPrivateKey) as string, contractAddress])
                            })}
                            onChange={handleChangeAddress}
                        />
                        {errors.toAddress && <p className="text-red-500 mt-2">Address is not valid.</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="amount" className="block font-semibold text-gray-800 dark:text-white">
                            Amount:
                        </label>
                        <input
                            type="text"
                            id="amount"
                            className={
                                `border rounded px-4 py-3 ${errors.amount ? 'border-red-500' : 'border-gray-300'
                                } text-gray-800 dark:text-white bg-transparent dark:bg-transparent w-full`
                            }
                            {...register(
                                'amount',
                                {
                                    pattern: /^[0-9]+$/,
                                    required: true,
                                    validate: tokensAmountValidator(convertNativeToETH(balance, tokenDecimalFactor))
                                })
                            }
                            onChange={handleChangeAmount}
                        />
                        {errors.amount && <p className="text-red-500 mt-2">
                            Amount is not valid. Max you have is <b>{convertNativeToETH(balance, tokenDecimalFactor) + ' ' + tokenSymbol}</b>
                        </p>}
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 flex items-center justify-center rounded font-semibold"
                        >
                            <span className="mr-2">Send</span>
                            <svg className={`animate-spin h-5 w-5 text-white ${isLoading ? '' : 'hidden'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 004 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20a8 8 0 100-16v4h-2V4a8 8 0 016.364 14.362l-2.647 3.001A7.963 7.963 0 0012 20z"></path>
                            </svg>
                        </button>
                    </div>
                    {progress?.message &&
                        <div className="bg-gray-900 border-l-4 border-blue-500 text-blue-700 p-4 mt-4">
                            <p className="mb-2">{progress.message}</p>
                            {progress.link && (
                                <p>
                                    <a
                                        href={progress.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline block truncate"
                                    >
                                        {progress.link}
                                    </a>
                                </p>
                            )}
                        </div>
                    }
                </form>
            </div>
        </div>
    );
};
