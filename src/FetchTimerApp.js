import React, { useState, useEffect, useCallback } from 'react';
import { useLoacalStorage } from './useLocalStorageState';
import Loader from './Loader';
import './FetchTimerApp.css'; // Import the CSS file

function FetchTimerApp({ coinName, setCoinName, wallet, setWallet }) {
  const [timer, setTimer] = useLoacalStorage(10 * 60, 'timer'); // Initial timer value in seconds
  const [newTimerMinutes, setNewTimerMinutes] = useLoacalStorage(
    10,
    'newTimerMinutes'
  ); // State for the user-set timer in minutes
  const [editTempTimer, setEditTempTimer] = useState(10); // State for the user-set timer in minutes
  const [isEditing, setIsEditing] = useState(false); // State to control timer editing
  const [data, setData] = useLoacalStorage([], 'data');
  const [isLoading, setIsLoading] = useState(false);
  const [firstFetch, setFirstFetch] = useLoacalStorage(false, 'firstFetch');
  const [previousTotal, setPreviousTotal] = useLoacalStorage(
    0,
    'previousTotal'
  );

  // Fetch function
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://pool.rplant.xyz/api/wallet/${coinName}/${wallet}`
      );
      const jsonData = await response.json();

      const timeNow = whatIsTheTime();

      const { coin, total: parsedTotal } = jsonData;
      const total = parseInt(parsedTotal);

      let difference = 0;
      if (previousTotal) {
        difference = total - previousTotal;
      }

      const newData = {
        coin,
        total,
        timeNow,
        difference,
      };

      setPreviousTotal(total);

      setData((data) => [...data, newData]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [
    coinName,
    wallet,
    previousTotal,
    setPreviousTotal,
    setData,
    setIsLoading,
  ]);

  useEffect(() => {
    document.title = 'Coin | ' + capitalizeFirstLetter(coinName);

    // Return a cleanup function to reset the title when the component unmounts
    return () => {
      document.title = 'rplantFetcher';
    };
  }, [coinName]);

  useEffect(() => {
    if (!firstFetch) {
      fetchData();
      setFirstFetch(true);
    }
  }, [firstFetch, fetchData, setFirstFetch]);

  // Effect to update the timer every second
  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (timer > 0) {
        setTimer((prevTimer) => prevTimer - 1);
      }
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, [timer, setTimer]);

  useEffect(() => {
    if (timer === 0) {
      fetchData();
      // Reset the timer to the user-set time in seconds
      setTimer(newTimerMinutes * 60);
    }
    if (timer === -1) {
      // Timer was reset, do nothing or perform any cleanup
    }
  }, [timer, fetchData, newTimerMinutes, setTimer]);

  // Function to handle timer input change
  function handleTimerInputChange(event) {
    setEditTempTimer(Number(event.target.value));
  }

  // Function to start editing the timer
  function startEditingTimer() {
    setIsEditing(true);
  }

  function applyNewTimer() {
    setIsEditing(false);
    setNewTimerMinutes(editTempTimer);
    setTimer(editTempTimer * 60);
  }

  function cancelApplyNewTimer() {
    setIsEditing(false);
    setEditTempTimer(newTimerMinutes);
  }
  function whatIsTheTime() {
    const now = new Date();
    const x = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    return x;
  }
  function resetData() {
    setPreviousTotal(0);
    setData([]);
    setFirstFetch(false);
    setTimer(newTimerMinutes * 60);
  }

  function resetAllInfo() {
    setCoinName('');
    setWallet('');
    // setData([]);
    localStorage.removeItem('timer');
    localStorage.removeItem('newTimerMinutes');
    localStorage.removeItem('data');
    localStorage.removeItem('firstFetch');
    localStorage.removeItem('previousTotal');
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="fetch-timer-app">
      <div className="app-version">
        <p>Ver 1.0</p>
      </div>
      <button onClick={resetAllInfo} className="reset-button">
        Reset Wallet / Coin
      </button>
      <button onClick={resetData} className="reset-button">
        Reset Data
      </button>
      <h1 className="app-title">{capitalizeFirstLetter(coinName)} Data App</h1>
      <p className="timer-text">
        Time Remaining : {` `}
        {Math.floor(timer / 60)
          .toString()
          .padStart(2, '0')}
        :{(timer % 60).toString().padStart(2, '0')}
      </p>
      {isEditing ? (
        <div className="edit-timer">
          <input
            type="number"
            value={editTempTimer}
            onChange={handleTimerInputChange}
            min="1"
            step="1"
            className="timer-input"
          />
          <span className="timer-unit"> minutes</span>
          <button onClick={applyNewTimer} className="apply-button">
            Apply
          </button>
          <button onClick={cancelApplyNewTimer} className="cancel-button">
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={startEditingTimer} className="set-timer-button">
          Set Timer
        </button>
      )}
      <table className="data-table">
        <thead>
          <tr>
            <th colSpan={3} className="coin-info">
              Coin : {capitalizeFirstLetter(coinName)}
            </th>
          </tr>
          <tr>
            <th colSpan={2} className="coin-info">
              {capitalizeFirstLetter(coinName)}
            </th>
            <th colSpan={1} className="wallet-info">
              {wallet}
            </th>
          </tr>
          <tr>
            <th className="table-header">Time</th>
            <th className="table-header">Total Coins</th>
            <th className="table-header">
              Earning Every {isEditing ? editTempTimer : newTimerMinutes}{' '}
              Minutes
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="data-cell">{item.timeNow}</td>
              <td className="data-cell">{item.total}</td>
              <td className="data-cell">{item.difference}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={3} className="data-cell">
              {isLoading && <Loader />}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default FetchTimerApp;
