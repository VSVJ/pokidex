import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { debounce } from "lodash";
import "../App.css";
import pokidex from "../images/pokidex_1.png";

const DetailedView = () => {
  const { pokemonName } = useParams();
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    // Fetch data for the Pokémon with the given name
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .then((response) => response.json())
      .then((data) => {
        setPokemon(data);
  
        // Fetch species data to get flavor text entries
        fetch(data.species.url)
          .then((response) => response.json())
          .then((speciesData) => {
            // Filter flavor text entries in English
            const flavorTextEntries = speciesData.flavor_text_entries.filter(
              (entry) => entry.language.name === "en"
            );
  
            // Select a random flavor text entry
            const randomEntry = flavorTextEntries[Math.floor(Math.random() * flavorTextEntries.length)];
  
            // Convert the text to speech
            const primaryType = data.types[0].type.name;
            const text = `${data.name} is a ${primaryType} type Pokémon. It has a height of ${data.height} and a weight of ${data.weight}. Flavor text: ${randomEntry.flavor_text}`;
            convertTextToSpeech(text);
          })
          .catch((error) => console.error("Error fetching species data:", error));
      })
      .catch((error) => console.error("Error fetching Pokémon data:", error));
  }, [pokemonName]);
  
  const [inputString, setInputString] = useState("");

  const convertTextToSpeech = async (text) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/run-python-script",
        { text }
      );

      if (response.status !== 200) {
        throw new Error("Failed to convert text to speech");
      }
    } catch (error) {
      console.error("Error converting text to speech:", error);
    }
  };

  // Use useCallback to memoize the debounced function
  const debouncedConvertTextToSpeech = useCallback(
    debounce(convertTextToSpeech, 10),
    []
  );

  useEffect(() => {
    debouncedConvertTextToSpeech(inputString);
  }, [inputString, debouncedConvertTextToSpeech]);

  if (!pokemon) {
    return <div>Loading...</div>;
  }

  return (
    <div className="detailed-view">
      <div class="container">
        {/* <img src={pokidex} alt="pokidex" className="pokemon-image" /> */}
        <div class="pokedex">
          <div class="circle-button"></div>
          <div class="lights">
            <div class="light red-light"></div>
            <div class="light yellow-light"></div>
            <div class="light green-light"></div>
          </div>
          <div class="screen"></div>
          <div class="red-button"></div>
          <div class="black-button"></div>
          <div class="slits">
            <div class="slit"></div>
            <div class="slit"></div>
          </div>
          <div class="green-area"></div>
          <div class="control-pad">
            <div class="control-button up"></div>
            <div class="control-button down"></div>
            <div class="control-button left"></div>
            <div class="control-button right"></div>
          </div>
        </div>
        <img
          src={pokemon.sprites.other.showdown.front_default}
          alt={pokemon.name}
          class="top-image"
        />
      </div>
      <h2>{pokemon.name}</h2>
      <p>Height: {pokemon.height}</p>
      <p>Weight: {pokemon.weight}</p>
      <p>
        Type: {pokemon.types.map((typeInfo) => typeInfo.type.name).join(", ")}
      </p>
      {/* Add more detailed information as needed */}
    </div>
  );
};

export default DetailedView;
