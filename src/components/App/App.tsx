import { useEffect, useState } from "react";
import { request } from "../../config/api";
import { Item } from '../../structures//classes/Item';
import "./App.css";

type Route = "home" | "items" | "create";

export default function App() {
  const [route, setRoute] = useState<Route>("home");

  return (
    <div id="app">
      <h2>Spencer Client</h2>

      <nav style={{ marginBottom: 12 }}>
        <button onClick={() => setRoute("home")}>Home</button>{" "}
        <button onClick={() => setRoute("items")}>Items</button>{" "}
        <button onClick={() => setRoute("create")}>Create</button>
      </nav>

      <div id="page">
        {route === "home" && <HomePage />}
        {route === "items" && <ItemsPage />}
        {route === "create" && <CreatePage />}
      </div>
    </div>
  );
}

function HomePage() {
  return <p>Use the tabs to call your Express API.</p>;
}

function ItemsPage() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState<string>("");

  async function load() {
    setError("");
    setItems(null);
    try {
      const data = await request<any[]>("", { method: "GET" });
      setItems(data.map((raw) => Item.fromApi(raw)));
    } catch (e) {
      setError(String(e));
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (items === null) return <p>Loading…</p>;

  return (
    <>
      <h3>All items</h3>
      <button onClick={load}>Refresh</button>
      <div id='item-list-container'>
        {items.map((item) => item.getItemComponent())}
      </div>
    </>
  );
}

function CreatePage() {
  const [name, setName] = useState("Sample Item");
  const [out, setOut] = useState<string>("—");

  async function create() {
    setOut("Creating…");
    try {
      const created = await request<Item>("", {
        method: "POST",
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
        placeholder="name"
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={create}>Create</button>

      <h4>Response</h4>
      <pre style={{ textAlign: "left" }}>{out}</pre>
    </>
  );
}