// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import DetailedView from './pages/DetailedView';
import './App.css';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Define the route for the home page */}
                <Route path="/" element={<Home />} />
                {/* Define the route for the detailed view page */}
                <Route path="/view/:pokemonName" element={<DetailedView />} />
            </Routes>
        </Router>
    );
};

export default App;
