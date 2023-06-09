import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getStoredEthPrivateKey } from '@/utils/localstorage';
import IndexPage from '@/app/page';

jest.mock('@/utils/localstorage', () => ({
    getStoredEthPrivateKey: jest.fn(),
}));

describe('Page', () => {
    it('renders LoginPage when ethPrivateKey is empty', () => {
        (getStoredEthPrivateKey as jest.Mock).mockReturnValue('');

        render(<IndexPage />);

        expect(screen.getByTestId('login-page')).toBeInTheDocument();
        expect(screen.queryByTestId('wallet-page')).not.toBeInTheDocument();
    });

    it('renders WalletPage when ethPrivateKey is not empty', () => {
        (getStoredEthPrivateKey as jest.Mock).mockReturnValue('d1d86ebd441b2a677ddcacbdcc3c72118ee13470c5755672bef82aaeac368d98');

        render(<IndexPage />);

        expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
        expect(screen.getByTestId('wallet-page')).toBeInTheDocument();
    });

    it('updates ethPrivateKey when setEthPrivateKey is called', async () => {
        (getStoredEthPrivateKey as jest.Mock).mockReturnValue('');

        render(<IndexPage />);

        const privateKey = 'somePrivateKey';
        const loginButton = screen.getByRole('button', { name: /login/i });

        userEvent.click(loginButton);

        await waitFor(() => {
            expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
            expect(screen.getByTestId('wallet-page')).toBeInTheDocument();
            expect(getStoredEthPrivateKey).toHaveBeenCalledTimes(1);
            expect(getStoredEthPrivateKey).toHaveBeenCalledWith();
        });

        expect(screen.getByText(privateKey)).toBeInTheDocument();
    });
});
