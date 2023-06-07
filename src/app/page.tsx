'use client'
import React, {useState, ChangeEvent, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { isValidPrivate, privateToPublic } from 'ethereumjs-util';

interface PrivateKeyFormData {
    privateKey: string;
}

const ethereumPrivateKeyValidator = (value: string): boolean => {
    try {
        return isValidPrivate(Buffer.from(value, 'hex'));
    } catch (error) {
        return false;
    }
};

const STORED_KEY_NAME = 'ethPrivateKey'
const storedEthPrivateKey = (() => {
    const storedItem = localStorage.getItem(STORED_KEY_NAME);
    if (storedItem) {
        if (ethereumPrivateKeyValidator(storedItem)) return storedItem
        localStorage.removeItem(STORED_KEY_NAME)
        return null
    }
    return null;
})();

export default function Page() {
    const {
        register,
        handleSubmit,
        formState: { errors , isSubmitted},
        setValue,
        reset,
    } = useForm<PrivateKeyFormData>({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });
    const [ethPrivateKey, setEthPrivateKey] = useState(storedEthPrivateKey);
    const [ethPublicKey, setEthPublicKey] = useState<string|null>(null);

    useEffect(() => {
        setEthPublicKey(ethPrivateKey ? privateToPublic(Buffer.from(ethPrivateKey, 'hex')).toString('hex') : null)
    }, [ethPrivateKey])

    const handlePrivateKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEthPrivateKey('');
        const value = event.target.value;
        setValue('privateKey', value.trim(), { shouldValidate: isSubmitted }); // Update the form value
    };

    const onSubmitStorePrivateKeyForm = (data: PrivateKeyFormData) => {
        setEthPrivateKey(data.privateKey);
        localStorage.setItem(STORED_KEY_NAME, data.privateKey);
        reset();
    };

    const clearPrivateKey = () => {
        setEthPrivateKey(null);
        localStorage.removeItem(STORED_KEY_NAME);
    }

    return (
        <div>
            {!ethPrivateKey ?
                <>
                    <div className="flex items-center justify-center h-screen">
                        <div className="max-w-xl w-full bg-gray-200 dark:bg-gray-800 shadow rounded-lg p-8 space-y-6">
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Wallet Login</h1>
                            <form onSubmit={handleSubmit(onSubmitStorePrivateKeyForm)} className="space-y-4">
                                <div className="mb-4">
                                    <label htmlFor="privateKey" className="block font-semibold text-gray-800 dark:text-white">
                                        Private Key:
                                    </label>
                                    <input
                                        type="text"
                                        id="privateKey"
                                        className={`border rounded px-4 py-3 ${
                                            errors.privateKey ? 'border-red-500' : 'border-gray-300'
                                        } text-gray-800 dark:text-white bg-transparent dark:bg-transparent w-full`}
                                        {...register('privateKey', { required: true, validate: ethereumPrivateKeyValidator })}
                                        onChange={handlePrivateKeyChange}
                                    />
                                    {errors.privateKey && <p className="text-red-500 mt-2">Private Key is not valid.</p>}
                                </div>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded font-semibold"
                                >
                                    Store
                                </button>
                            </form>
                        </div>
                    </div>
                </> :
                null
            }

            {ethPrivateKey &&
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">ETH ERC20 Wallet</h1>
                    <p className="text-green-500 mt-4">{ethPublicKey}</p>
                    <button
                        onClick={clearPrivateKey}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded font-semibold"
                    >
                        Clear
                    </button>
                </div>
            }
        </div>
    );
}
