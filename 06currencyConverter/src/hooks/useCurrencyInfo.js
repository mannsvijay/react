import { useState, useEffect } from "react";

function useCurrencyInfo(currency) {
  const [data,    setData]    = useState({});
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!currency) return;
    setLoading(true);
    setError(null);

    fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(res => {
        setData(res.rates || {});
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [currency]);

  return { data, loading, error };
}

export default useCurrencyInfo;










//  const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`);
//         const result = await response.json();
//         setData(result);
//       } catch (error) {
//         console.error("Error fetching currency info:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (currency) {
//       fetchData();
//     }
//   }, [currency]);

//   return { data, loading };