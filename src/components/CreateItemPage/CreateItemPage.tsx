import { useState } from 'react';
import { request } from '../../config/api';
import { Item } from '../../structures/classes/Item';

export default function CreateItemPage() {
  const [name, setName] = useState('Sample Item');
  const [out, setOut] = useState<string>('—');

  async function create() {
    setOut('Creating…');
    try {
      const created = await request<Item>('/add', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });

      setOut(JSON.stringify(created, null, 2));
    } catch (e) {
      setOut(String(e));
    }
  }

  return (
    <>
      <h3>Create item</h3>
      <input
        value={name}
        placeholder='name'
        onChange={(e) => setName(e.target.value)}
      />
      {' '}
      <button onClick={create}> Create </button>

      <h4>Response</h4>
      <pre style={{ textAlign: 'center' }}>{out}</pre>
    </>
  );
}