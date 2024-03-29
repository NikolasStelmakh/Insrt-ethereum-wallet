import React, {ChangeEvent} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {STORED_ETH_WALLET_PRIVATE_KEY_NAME} from "@/utils/localstorage";
import {ethereumPrivateKeyValidator} from "@/utils/validators";

interface PrivateKeyFormData {
    privateKey: string;
}

export default function WalletLogin () {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted },
        setValue,
        reset,
    } = useForm<PrivateKeyFormData>({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });
    const handlePrivateKeyChangeDuringLogin = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValue('privateKey', value.trim(), { shouldValidate: isSubmitted }); // Update the form value
    };

    const onSubmitLogin = (data: PrivateKeyFormData) => {
        localStorage.setItem(STORED_ETH_WALLET_PRIVATE_KEY_NAME, data.privateKey);
        reset();
        router.push('/')
    };

    return (
        <div className="flex items-center justify-center h-screen" data-testid="login-wallet-form">
            <div className="max-w-xl w-full shadow rounded-lg p-8 space-y-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex justify-center">Wallet Login</h1>
                <form onSubmit={handleSubmit(onSubmitLogin)} className="space-y-4">
                    <div className="mb-4">
                        <label htmlFor="privateKey" className="block font-semibold text-gray-800 dark:text-white">
                            Private Key:
                        </label>
                        <input
                            type="text"
                            id="privateKey"
                            className={
                                `border rounded px-4 py-3 ${errors.privateKey ? 'border-red-500' : 'border-gray-300'
                                } text-gray-800 dark:text-white bg-transparent dark:bg-transparent w-full`
                            }
                            {...register('privateKey', { required: true, validate: ethereumPrivateKeyValidator })}
                            onChange={handlePrivateKeyChangeDuringLogin}
                        />
                        {errors.privateKey && <p className="text-red-500 mt-2">Private Key is not valid.</p>}
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded font-semibold"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
