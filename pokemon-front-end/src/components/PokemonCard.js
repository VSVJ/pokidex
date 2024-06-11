// PokemonCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const PokemonCard = ({ pokemon }) => {
    return (
        <div className="pokemon-card">
            <h2>{pokemon.name}</h2>
            <Link to={`/view/${pokemon.name}`}>
                <img src={pokemon.sprites.other.showdown.front_default} alt={pokemon.name} />
            </Link>
            <p>Height: {pokemon.height}</p>
            <p>Weight: {pokemon.weight}</p>
            <p>Type: {pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
        </div>
    );
};

export default PokemonCard;
