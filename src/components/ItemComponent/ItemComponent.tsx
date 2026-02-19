import { Item } from '../../structures/classes/Item';
import { request } from "../../config/api";
import "./ItemComponent.css";

export function ButtonItemComponent({ item, callback }: { item: Item, callback?: () => void }) {
  async function withdraw() {
    try {
      const created = await request<Item>(`/withdraw/${item.id}`, {
        method: "POST",
        body: JSON.stringify({ id: item.id }),
      });

      callback?.();
      alert(`Withdrawn item:\n${JSON.stringify(created, null, 2)}`);
    } catch (e) {
      alert(`Error withdrawing item:\n${String(e)}`);
    }
  }

  return(
    <div className='withdraw-button item-main-container' onClick={withdraw}>
      <h2>{item.id} - {item.name}</h2>
      <p>{item.createdAt.toLocaleString()}</p>
      <p>{item.updatedAt.toLocaleString()}</p>
    </div>
  );
}

export function ItemComponent({ item }: { item: Item }) {
  return(
    <div className='item-main-container'>
      <h2>{item.id} - {item.name}</h2>
      <p>{item.createdAt.toLocaleString()}</p>
      <p>{item.updatedAt.toLocaleString()}</p>
    </div>
  );
}