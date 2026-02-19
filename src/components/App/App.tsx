import { useState } from 'react';
import HomePage from '../HomePage/HomePage';
import WithdrawItemPage from '../WithdrawItemPage/WithdrawItemPage';
import CreatePage from '../CreateItemPage/CreateItemPage';
import './App.css';

type Route = 'home' | 'withdraw' | 'create';

export default function App() {
  const [route, setRoute] = useState<Route>('home');

  return (
    <div id='app'>
      <h2>Spencer Client</h2>

      <nav style={{ marginBottom: 12 }}>
        <button onClick={() => setRoute('home')}> Home </button>{' '}
        <button onClick={() => setRoute('withdraw')}> Items </button>{' '}
        <button onClick={() => setRoute('create')}> Create </button>
      </nav>

      <div id='page'>
        {route === 'home' && <HomePage />}
        {route === 'withdraw' && <WithdrawItemPage />}
        {route === 'create' && <CreatePage />}
      </div>
    </div>
  );
}