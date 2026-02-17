import { Item } from '../../structures/classes/Item';
import "./ItemComponent.css";

export default function ItemComponent({ item }: { item: Item }) {
  return(
    <div className='item-main-container'>
      <h2>{item.id} - {item.name}</h2>
      <p>{item.createdAt.toLocaleString()}</p>
      <p>{item.updatedAt.toLocaleString()}</p>
    </div>
  );
}