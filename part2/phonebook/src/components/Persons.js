const Persons = ( {persons, deletePerson} ) => {
    return (
      <div>
        {persons.map((person, index) => 
            <div key={index}> 
              <span> {person.name} {person.number} </span>
              <button type="button" onClick={() => deletePerson(person.name, person.id)}>
                delete
              </button>
            </div>
        )}
      </div>
    )
  }
  
  export default Persons;