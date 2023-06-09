import React from "react";

export default function SubmitButton ({
    title = 'Submit',
    isLoading,
} : {
    isLoading: boolean,
    title?: string,
}) {
    return (
        <div className="flex justify-center">
            <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 flex items-center justify-center rounded font-semibold"
            >
                <span className="mr-2">{title}</span>
                <svg className={`animate-spin h-5 w-5 text-white ${isLoading ? '' : 'hidden'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 004 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20a8 8 0 100-16v4h-2V4a8 8 0 016.364 14.362l-2.647 3.001A7.963 7.963 0 0012 20z"></path>
                </svg>
            </button>
        </div>
    );
};
