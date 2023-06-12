import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import { getStoredEthPrivateKey } from '@/utils/localstorage';
import IndexPage from '@/app/page';

jest.mock('@/utils/localstorage', () => ({
    getStoredEthPrivateKey: jest.fn(),
}));

const PRIVATE_KEY = 'd1d86ebd441b2a677ddcacbdcc3c72118ee13470c5755672bef82aaeac368d98'

describe('Page', () => {
    it('renders nothing by default', async () => {
        (getStoredEthPrivateKey as jest.Mock).mockReturnValue('');

        render(<IndexPage />);

        expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
        expect(screen.queryByTestId('wallet-page')).not.toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByTestId('wallet-form')).toBeInTheDocument();
            expect(getStoredEthPrivateKey).toHaveBeenCalledTimes(1);
            expect(getStoredEthPrivateKey).toHaveBeenCalledWith();
        });
    });


    it('renders WalletPage when ethPrivateKey is not empty', async () => {
        (getStoredEthPrivateKey as jest.Mock).mockReturnValue('d1d86ebd441b2a677ddcacbdcc3c72118ee13470c5755672bef82aaeac368d98');

        render(<IndexPage />);

        expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
        expect(screen.queryByTestId('wallet-page')).not.toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByTestId('wallet-dashboard-container')).toBeInTheDocument();
            expect(getStoredEthPrivateKey).toHaveBeenCalledTimes(2);
            expect(getStoredEthPrivateKey).toHaveBeenCalledWith();
        });
    });
});
