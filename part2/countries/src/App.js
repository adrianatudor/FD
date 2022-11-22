import {useEffect, useState} from 'react';
import axios from 'axios';
import Countries from './components/Countries';

function App() {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data);
      })
  }, []);

  const handleFilter = (event) => {
    setFilter(event.target.value);
  }

  const handleClick = (countryName) => {
    setFilter(countryName);
  }

  return (
    <div>
      find countries <input value={filter} onChange={handleFilter}/>
      <Countries countries={countries} filter={filter} handleClick={handleClick} />      
    </div>
  );
}

export default App;