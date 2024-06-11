import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { debounce } from "lodash";
import "../App.css";
import pokidex from "../images/pokidex_1.png";

const DetailedView = () => {
  const { pokemonName } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [inputString, setInputString] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchPokemonData = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const data = await response.json();

        if (isMounted) {
          setPokemon(data);

          const speciesResponse = await fetch(data.species.url);
          const speciesData = await speciesResponse.json();

          const flavorTextEntries = speciesData.flavor_text_entries.filter(
            (entry) => entry.language.name === 'en'
          );

          const randomEntry = flavorTextEntries[Math.floor(Math.random() * flavorTextEntries.length)];

          const primaryType = data.types[0].type.name;
          const text = `${data.name} is a ${primaryType} type Pokémon. ${randomEntry.flavor_text}`;

          convertTextToSpeech(text);
        }
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      }
    };

    fetchPokemonData();

    return () => {
      isMounted = false;
    };
  }, [pokemonName]);

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

  const debouncedConvertTextToSpeech = useCallback(
    debounce(convertTextToSpeech, 1000),
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
      <div className="container">
        {/* <img src={pokidex} alt="pokidex" className="pokemon-image" /> */}
        <div className="pokedex">
          <div className="circle-button"></div>
          <div className="lights">
            <div className="light red-light"></div>
            <div className="light yellow-light"></div>
            <div className="light green-light"></div>
          </div>
          <div className="screen"></div>
          <div className="red-button"></div>
          <div className="black-button"></div>
          <div className="slits">
            <div className="slit"></div>
            <div className="slit"></div>
          </div>
          <div className="green-area"></div>
          <div className="control-pad">
            <div className="control-button up"></div>
            <div className="control-button down"></div>
            <div className="control-button left"></div>
            <div className="control-button right"></div>
          </div>
        </div>
        <img
          src={pokemon.sprites.other.showdown.front_default}
          alt={pokemon.name}
          className="top-image"
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
