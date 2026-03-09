import { useState , useEffect} from "react";

function useCurrencyInfo(currency) {
     const  [data, setData] = useState({});
     useEffect(()=>{
          fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`)
          .then(res=>res.json())
          .then((res)=> setData(res["rates"]))

     },[currency])
     return data;
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