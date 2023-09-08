import './App.css';
import FetchTimerApp from './FetchTimerApp';
import UserCoinAndWallet from './UserCoinAndWallet';
import { useLoacalStorage } from './useLocalStorageState';

function App() {
  const [coinName, setCoinName] = useLoacalStorage('', 'coinName');
  const [wallet, setWallet] = useLoacalStorage('', 'wallet');

  function hundleCoinAndWallet(coin, wallet) {
    setCoinName(coin);
    setWallet(wallet);
  }

  return (
    <div className="App">
      {!coinName ? (
        <UserCoinAndWallet onAddCoinAndWallet={hundleCoinAndWallet} />
      ) : (
        <FetchTimerApp
          coinName={coinName}
          wallet={wallet}
          setWallet={setWallet}
          setCoinName={setCoinName}
        />
      )}
    </div>
  );
}

export default App;
