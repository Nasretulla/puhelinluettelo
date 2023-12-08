import React from "react";

const Persons = ({ persons, poistaHenkilo }) => {
  return (
    <div>
      {persons.map((person) => (
        <p key={person.name}>
          {person.name} {person.numero}{"->"}
          <button onClick={() => poistaHenkilo(person.id)}>Delete</button>
        </p>
      ))}
    </div>
  );
};

export default Persons;
