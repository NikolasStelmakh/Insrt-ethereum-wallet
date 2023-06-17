import {useForm} from "react-hook-form";
import React, {ChangeEvent, useState} from "react";
import {ethers} from "ethers";
import {convertNativeToETH, WalletInstance} from "@/utils/ethers";
import {transferAddressValidator, tokensAmountValidator} from "@/utils/validators";
import SubmitButton from "@/components/buttons/SubmitButton";

interface SendFormData {
    toAddress: string;
    amount: string;
}

export default function SendERC20Tokens ({
    contractInstance,
    balance,
    tokenDecimalFactor,
    tokenSymbol,
    contractAddress,
    walletAddress,
    setTokensBalance,
    walletInstance,
} : {
    contractInstance: ethers.Contract,
    balance: string,
    tokenDecimalFactor: string,
    tokenSymbol: string,
    contractAddress: string,
    walletAddress: string,
    setTokensBalance: (value: string | null) => void,
    walletInstance: WalletInstance;
}) {
    const [progress, setProgress] = useState<{
        message: string;
        link?: string;
        isSuccess?: boolean;
        isError?: boolean;
    } | null>(null);
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
            await walletInstance.sendTokensWithContract({
                contractInstance,
                setProgress,
                tokenDecimalFactor,
                toAddress: data.toAddress,
                amount: data.amount
            })
            resetField('amount');
            setTokensBalance((await contractInstance.balanceOf(walletAddress)).toString());
        } catch (e) {
            console.log('Error sending tokens: ' + JSON.stringify(e, null, 2));
            setProgress({
                message: 'Error sending tokens: ' + JSON.stringify(e, null, 2),
                isSuccess: false,
                isError: true
            });
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
                                validate: transferAddressValidator([walletInstance.getAddress(), contractAddress])
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
                            Amount is not valid. You have <b>{convertNativeToETH(balance, tokenDecimalFactor) + ' ' + tokenSymbol}</b>
                        </p>}
                    </div>
                    <SubmitButton isLoading={isLoading} title="Send"/>
                    {progress?.message &&
                        <div className={
                                `bg-gray-900 border-l-4 border-blue-500 text-blue-700 ${
                                    progress.isSuccess ? 'border-green-500 text-green-700' : ''
                                } ${
                                    progress.isError ? 'border-red-500 text-red-500' : ''
                                } p-4 mt-4`
                            }
                        >
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
