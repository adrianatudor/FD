import CountryInfo from "./CountryInfo";

const Countries = ({ countries, filter, handleClick }) => {
  const filteredCountries = filter.length > 0 ?
    countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase())) :
    countries;
    
  if (filter.length === 0) {
    return ( 
      <div> Please type above to find a country. </div>
    )
  } else if (filteredCountries.length > 10 && filter.length > 0) {
    return (
      <div> Too many matches. Specify another filter. </div>
    );
  } else if (filteredCountries.length === 1) {
    return (
      <CountryInfo country={filteredCountries[0]} />
    )
  } else {
    return (
      <div>
        {filteredCountries.map(country => {
          return (
            <div key={country.cca2}>
              <span> {country.name.common} </span>
              <button onClick={() => handleClick(country.name.common)}> show </button>
            </div>
          )
        })}
      </div>
    )
  }
}

export default Countries;