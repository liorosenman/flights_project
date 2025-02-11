import React from 'react';
// import logo from './logo.svg';
import { Counter } from './features/counter/Counter.tsx';
import './App.css';
import FlightBoard from './components/FlightsBoard/FlightsBoard.tsx';

const App = () => {
  return (
    <div>
      <FlightBoard />
    </div>
  );
};

export default App;
