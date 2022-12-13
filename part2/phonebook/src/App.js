import { useEffect, useState } from 'react'
import Filter from './components/Filter';
import Notification from './components/Notification';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import personsApi from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([{}]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState('')
  const [notificationType, setNotificationType] = useState('')

  useEffect(() => {    
    personsApi.getAll()
    .then(response => {
      setPersons(response)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber
    }

    const found = persons.find(person => person.name === newName);

    if (found) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with the new one ?`)) {
        const updatedPerson = {...found, number: newNumber};

        personsApi.update(found.id, updatedPerson)
        .then(response => {
          setPersons(persons.map(person => person.id === response.id ? response : person));
          setNotification(`${response.name}'s number has been successfully updated.`);
          setNotificationType('success');

          setTimeout(() => {
            setNotification(null)
          }, 5000);
        })
        .catch(error => {
          setPersons(persons.filter(person => person.id !== found.id));
          setNotification(`Information of ${found.name} has already been removed from server.`);
          setNotificationType('error');

          setTimeout(() => {
            setNotification(null)
          }, 5000);
        })
      }
    } else {
      personsApi
      .create(personObject)
      .then(response => {
          setPersons(persons.concat(response));

          setNotification(`Added ${response.name}.`);
          setNotificationType('success');

          setTimeout(() => {
            setNotification(null)
          }, 5000);
      })
      .catch(error => {
        // this is the way to access the error message
        setNotification(error.response.data.error);
        setNotificationType('error');
        
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
    }

    setNewName('');
    setNewNumber('');
  }

  const deletePerson = (name, id) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsApi.remove(id);

      setPersons(persons.filter(person => person.id !== id));
    }
  }

  const handleNameChange = (event) => {    
    setNewName(event.target.value)  
  }

  const handleNumberChange = (event) => {    
    setNewNumber(event.target.value)  
  }

  const handleFilterChange = (event)=>{
    setFilter(event.target.value);
  }

  const filteredPersons =
    filter ?
      persons.filter(person => person.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1)
    : 
      persons;

  return (
    <div>
      <h2> Phonebook </h2>
      <Notification notification={notification} notificationType={notificationType}/>
      <Filter value={filter} onFilterChange={handleFilterChange} />
      <h2> add a new </h2>
      <PersonForm
        onSubmit={addPerson} 
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        name={newName}
        number={newNumber}
      />
      <h2> Numbers </h2>
      <Persons persons={filteredPersons} deletePerson={deletePerson} />
    </div>
  )
}

export default App;