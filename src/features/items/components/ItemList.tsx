
import { FC } from "react";
import { SelectItems } from "../utils/types";
import ItemRow from "./ItemRow";

const ItemList: FC<{ items: SelectItems[] }> = ({ items }) => {
  return (
    <div className={`grid grid-cols-1 gap-3`}>
      {items.map(item => (
        <ItemRow key={item.id} item={item} />
      ))}
    </div>
  )
}

export default ItemList