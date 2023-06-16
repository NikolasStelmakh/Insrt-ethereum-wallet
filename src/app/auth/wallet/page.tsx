'use client'
import React, { useEffect } from 'react';
import {useRouter} from "next/navigation";
import { getStoredWalletPrivateKey } from "@/utils/localstorage";
import LoginPage from "@/components/forms/WalletLogin";

export default function Page() {
    const router = useRouter();

    useEffect(() => {
        if (getStoredWalletPrivateKey().length > 0) router.push('/')
    }, [router]);

    return (
        <div>
            <LoginPage data-testid="login-page" />
        </div>
    );
}
