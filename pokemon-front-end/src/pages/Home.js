import React, { useState, useEffect, useCallback } from 'react';
import PokemonCard from '../components/PokemonCard';
import axios from 'axios';
import debounce from 'lodash.debounce';

const Home = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchPokemon = async (offset) => {
        setLoading(true);
        console.log(`Fetching Pokémon with offset ${offset}`);
        try {
            const response = await axios.get(`/api/pokemon?limit=30&offset=${offset}`);
            setPokemonList(prevList => [...prevList, ...response.data]);
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Using useCallback to memoize the debounced fetch function
    const debouncedFetchPokemon = useCallback(
        debounce((offset) => fetchPokemon(offset), 300),
        [] // Empty dependency array means this will not change across re-renders
    );

    useEffect(() => {
        debouncedFetchPokemon(offset);

        // Cleanup function to cancel debounced calls on unmount
        return () => {
            debouncedFetchPokemon.cancel();
        };
    }, [offset, debouncedFetchPokemon]);

    const loadMore = () => {
        setOffset(prevOffset => prevOffset + 30);
    };

    return (
        <div className="App">
            <h1>Pokémon Cards</h1>
            <div className="pokemon-list">
                {pokemonList.map(pokemon => (
                    <PokemonCard key={pokemon.id} pokemon={pokemon} />
                ))}
            </div>
            {loading ? <p>Loading...</p> : <button onClick={loadMore}>Load More</button>}
        </div>
    );
};

export default Home;
