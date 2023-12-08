import { useState, useEffect } from "react";
import axios from "axios";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import Persons from "./Persons";
import servicePeople from "./services/people";
import Notification from "./Notification";
import Error from "./Error";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [number, setNumber] = useState("");
  const [find, setFind] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    console.log("use effect");
    servicePeople.getAll().then((initialResponse) => {
      setPersons(initialResponse);
    });
  }, []);
  console.log("render", persons.length, "henkilöä");

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNumber(event.target.value);
  };

  const handleFindChange = (event) => {
    console.log(event.target.value);
    setFind(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      console.log("tarkistus onko henkilö olemassa?", existingPerson);
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );
      if (confirmUpdate) {
        const changedPerson = { ...existingPerson, numero: number };

        servicePeople
          .update(existingPerson.id, changedPerson)

          .then((updatedPerson) => {
            console.log("tässä päivitetty henkilö", changedPerson);
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : updatedPerson
              )
            );
            setMessage(`updated '${updatedPerson.name}'`);
            setTimeout(() => {
              setMessage(null);
            }, 3000);
          });
      }
    } else {
      const newPerson = { name: newName, numero: number };

      servicePeople
        .create(newPerson)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          console.log("Tässä luotu henkilö", returnedPerson);
          setMessage(`Added '${newPerson.name}'`);
          console.log("luotu henkilö lisätty", newPerson);
          setTimeout(() => {
            setMessage(null);
          }, 3000);
        })
        .catch((error) => {
          setErrorMessage(`Error adding `, returnedPerson);
          setTimeout(() => {
            setErrorMessage(null);
          }, 3000);
        });
      setNewName("");
      setNumber("");
    }
  };

  const poistaHenkilo = (id) => {
    const poistettava = persons.find((D) => D.id === id);
    if (window.confirm(`Delete ${poistettava.name}?`)) {
      servicePeople
        .remove(id)
        .then(() => {
          setPersons(persons.filter((D) => D.id !== id));
          setMessage(`Deleted '${poistettava.name}'`);
          console.log("Tässä poistettun henkilön tiedot", poistettava);
          setTimeout(() => {
            setErrorMessage(null);
          }, 3000);
        })
        .catch((error) => {
          setErrorMessage(`Error deleting '${poistettava.name}'`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 3000);
        });
    }
  };
  const findPerson = persons.filter(
    (person) =>
      person.name && person.name.toLowerCase().includes(find.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} />
      <Error message={errorMessage} />

      <div>
        <Filter value={find} onChange={handleFindChange} />
      </div>
      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        number={number}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        onSubmit={addPerson}
      />
      <h2>Numbers</h2>
      <Persons persons={findPerson} poistaHenkilo={poistaHenkilo} />
    </div>
  );
};

export default App;
