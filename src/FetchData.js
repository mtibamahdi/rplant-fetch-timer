// Fetch function
async function fetchData() {
  try {
    // Make your API request here
    const response = await fetch(
      `https://pool.rplant.xyz/api/wallet/${coinState}/${wallet}`
    );
    const jsonData = await response.json();

    const timeNow = whatIsTheTime();

    const { coin, total: parsedTotal } = jsonData;
    const total = parseInt(parsedTotal);

    let difference = 0;
    if (previousTotal.current) {
      difference = total - previousTotal.current;
    }

    const newData = {
      coin,
      total,
      timeNow,
      difference,
    };
    console.log(newData);

    previousTotal.current = total;

    setData((data) => [...data, newData]);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
