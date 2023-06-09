import {useForm} from "react-hook-form";
import React, {ChangeEvent} from "react";
import {STORED_ETH_ERC20_ADDRESS} from "@/utils/localstorage";
import {ethereumAddressValidator} from "@/utils/validators";

interface ContractAddressFormData {
    contractAddress: string;
}

export default function ContractLogin ({setContractAddress} : {setContractAddress: (val: string | null) => void}) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted },
        setValue,
        reset,
    } = useForm<ContractAddressFormData>({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });
    const handleChangeContractAddress = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValue('contractAddress', value.trim(), { shouldValidate: isSubmitted }); // Update the form value
    };

    const onSubmitLogin = (data: ContractAddressFormData) => {
        setContractAddress(data.contractAddress);
        localStorage.setItem(STORED_ETH_ERC20_ADDRESS, data.contractAddress);
        reset();
    };

    return (
        <div className="flex justify-center">
            <div className="max-w-xl w-full shadow rounded-lg p-8 space-y-6">
                <form onSubmit={handleSubmit(onSubmitLogin)} className="space-y-4">
                    <div className="mb-4">
                        <label htmlFor="contractAddress" className="block font-semibold text-gray-800 dark:text-white">
                            Contract Address:
                        </label>
                        <input
                            type="text"
                            id="contractAddress"
                            className={
                                `border rounded px-4 py-3 ${errors.contractAddress ? 'border-red-500' : 'border-gray-300'
                                } text-gray-800 dark:text-white bg-transparent dark:bg-transparent w-full`
                            }
                            {...register('contractAddress', { required: true, validate: ethereumAddressValidator })}
                            onChange={handleChangeContractAddress}
                        />
                        {errors.contractAddress && <p className="text-red-500 mt-2">Contract Address is not valid.</p>}
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded font-semibold"
                        >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
