import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { getAddressFromPrivateKey, getEthBalance } from '@/utils/ethers';
import WalletPage from '@/components/Wallet';

jest.mock('@/utils/ethers', () => ({
    getAddressFromPrivateKey: jest.fn(),
    getEthBalance: jest.fn(),
}));

jest.mock('@/utils/localstorage', () => ({
    STORED_ETH_PRIVATE_KEY_NAME: 'd1d86ebd441b2a677ddcacbdcc3c72118ee13470c5755672bef82aaeac368d98',
}));

describe('WalletPage', () => {
    const walletPrivateKey = 'somePrivateKey';
    const setEthPrivateKey = jest.fn();

    beforeEach(() => {
        (getAddressFromPrivateKey as jest.Mock).mockReturnValue('someAddress');
        (getEthBalance as jest.Mock).mockResolvedValue('10.0');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders wallet details and ERC20 dashboard', async () => {
        render(<WalletPage walletPrivateKey={walletPrivateKey} setEthPrivateKey={setEthPrivateKey} />);

        expect(screen.getByText('Your ETH Wallet')).toBeInTheDocument();
        expect(screen.getByText('Network:')).toBeInTheDocument();
        expect(screen.getByText('Wallet Address:')).toBeInTheDocument();
        expect(screen.getByText('Balance:')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
        expect(screen.getByText('Loading...')).toBeInTheDocument();

        await screen.findByText('10.0 ETH');

        expect(screen.getByText('10.0 ETH')).toBeInTheDocument();
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();

        expect(getAddressFromPrivateKey).toHaveBeenCalledWith(walletPrivateKey);
        expect(getEthBalance).toHaveBeenCalledWith(walletPrivateKey);
    });

    it('copies wallet address to clipboard when clicked', async () => {
        render(<WalletPage walletPrivateKey={walletPrivateKey} setEthPrivateKey={setEthPrivateKey} />);

        const walletAddressElement = screen.getByText('someAddress');
        fireEvent.click(walletAddressElement);

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('someAddress');
        expect(screen.getByText('Copied to clipboard!')).toBeInTheDocument();

        jest.useFakeTimers();
        jest.advanceTimersByTime(2000);

        expect(screen.queryByText('Copied to clipboard!')).not.toBeInTheDocument();
    });

    it('clears private key and removes from local storage when logout button is clicked', () => {
        render(<WalletPage walletPrivateKey={walletPrivateKey} setEthPrivateKey={setEthPrivateKey} />);

        const logoutButton = screen.getByRole('button', { name: /logout/i });
        fireEvent.click(logoutButton);

        expect(setEthPrivateKey).toHaveBeenCalledWith('');
        expect(localStorage.removeItem).toHaveBeenCalledWith('storedEthPrivateKey');
    });
});
