// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

const characters = [
  {
    name: "Charlie",
    job: "Janitor"
  },
  {
    name: "Mac",
    job: "Bouncer"
  },
  {
    name: "Dee",
    job: "Aspring actress"
  },
  {
    name: "Dennis",
    job: "Bartender"
  }
];

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(index) {

    const character = characters[index];

    const id = character.id;

    fetch(`http://localhost:8000/users/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (res.status === 204) {
          const updated = characters.filter((character, i) => {
            return i !== index;
          });
          setCharacters(updated);
        } else {
          throw new Error("Failed to delete user");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function updateList(person) {
    setCharacters([...characters, person]);
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function postUser(person) {
    return fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(person)
    }).then((res) => {
      if (res.status === 201) {
        return res.json(); 
      } else {
        throw new Error("Failed to create user");
      }
    });
  }

  function updateList(person) {
    postUser(person)
      .then((response) => {
        const createdUser = response.user;
        setCharacters((characters) => [...characters, createdUser]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
