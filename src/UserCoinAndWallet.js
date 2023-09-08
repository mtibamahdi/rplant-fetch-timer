import React, { useRef } from 'react';
import './UserCoinAndWallet.css';

export default function UserCoinAndWallet({ onAddCoinAndWallet }) {
  const coinInputRef = useRef(null);
  const walletInputRef = useRef(null);

  function handleAdd() {
    const coin = coinInputRef.current.value.toLowerCase();
    const wallet = walletInputRef.current.value;
    onAddCoinAndWallet(coin, wallet);
  }

  function handleAutoFill() {
    coinInputRef.current.value = 'reaction';
    walletInputRef.current.value = 'Rvoe3qdeKc4KpdxAcQd5XY7nJkNKbcFCpB';
  }

  return (
    <div className="user-coin-wallet-container">
      <h2 className="user-coin-wallet-title">Coin and Wallet</h2>
      <input
        className="user-coin-wallet-input"
        type="text"
        placeholder="Coin"
        ref={coinInputRef}
      />
      <input
        className="user-coin-wallet-input"
        type="text"
        placeholder="Wallet"
        ref={walletInputRef}
      />
      <div className="user-coin-wallet-button-container">
        <button className="user-coin-wallet-button" onClick={handleAutoFill}>
          Auto Fill
        </button>
        <button className="user-coin-wallet-button" onClick={handleAdd}>
          Go
        </button>
      </div>
    </div>
  );
}
