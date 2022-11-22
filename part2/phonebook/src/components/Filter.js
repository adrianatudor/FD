const Filter = (props) => {
  return (
    <div>
      <label htmlFor="mySearch"> filter shown with a </label>
      <input
        type="search"
        id="mySearch"
        value={props.value}
        onChange={props.onFilterChange}
      />
    </div>
  )
}

export default Filter;