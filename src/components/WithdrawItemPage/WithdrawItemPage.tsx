import { useEffect, useState } from "react";
import { request } from "../../config/api";
import { Item } from '../../structures/classes/Item';
import "./WithdrawItemPage.css";

export default function WithdrawItemPage() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState<string>("");

  async function load() {
    setError("");
    setItems(null);

    try {
      const data = await request<any[]>('/list', { method: "GET" });
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
      <hr style={{ margin: '30px' }} />
      <div className='item-list-container'>
        {items.map((item) => (
          <div key={item.id}>
            {item.getButtonItemComponent(load)}
          </div>
        ))}
      </div>
    </>
  );
}