import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import { getStoredWalletPrivateKey } from '@/utils/localstorage';
import IndexPage from '@/app/page';
import { useRouter } from 'next/navigation';

const PRIVATE_KEY = 'd1d86ebd441b2a677ddcacbdcc3c72118ee13470c5755672bef82aaeac368d98';

jest.mock('@/utils/localstorage', () => ({
    getStoredWalletPrivateKey: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('IndexPage', () => {
    it('redirects to authorization when there is no stored wallet private key.', async () => {
        (getStoredWalletPrivateKey as jest.Mock).mockReturnValue('');

        const mockedRouterPush = jest.fn();

        (useRouter as jest.Mock).mockReturnValue({
            push: mockedRouterPush,
        });

        render(<IndexPage />);

        expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
        expect(screen.queryByTestId('wallet-page')).not.toBeInTheDocument();

        await waitFor(() => {
            expect(mockedRouterPush).toHaveBeenCalledTimes(1);
            expect(getStoredWalletPrivateKey).toHaveBeenCalledTimes(1);
            expect(getStoredWalletPrivateKey).toHaveBeenCalledWith();
        });
    });

    it('renders WalletPage when stored wallet private key is not empty', async () => {
        (getStoredWalletPrivateKey as jest.Mock).mockReturnValue(PRIVATE_KEY);

        const mockedRouterPush = jest.fn();

        (useRouter as jest.Mock).mockReturnValue({
            push: mockedRouterPush,
        });

        render(<IndexPage />);

        expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
        expect(screen.queryByTestId('wallet-page')).not.toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByTestId('wallet-dashboard-container')).toBeInTheDocument();
            expect(getStoredWalletPrivateKey).toHaveBeenCalledTimes(3);
            expect(getStoredWalletPrivateKey).toHaveBeenCalledWith();
            expect(mockedRouterPush).toHaveBeenCalledTimes(0);
        });
    });
});
