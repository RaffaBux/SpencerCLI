import ItemComponent from "../../components/ItemComponent/ItemComponent";

export class Item {
  public id: number;
  public name: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(id: number, name: string, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromApi(raw: any): Item {
    return new Item(
      raw._id ?? String(raw.id),
      raw.name,
      new Date(raw.createdAt),
      new Date(raw.updatedAt)
    );
  }

  getItemComponent() {
    return (
      <ItemComponent item={this} />
    );
  }

  getItemInfo() {
    return JSON.stringify(this, null, 2);
  }
}