"use client"

import { FC, useState } from 'react'
import { SelectItems } from '../utils/types'
import EditItemRow from './EditItemRow'
import ReadItemRow from './ReadItemRow'

const ItemRow: FC<{ item: SelectItems }> = ({ item }) => {

  const [mode, setMode] = useState<"read" | "edit">("read")

  if (mode === "read") return <ReadItemRow item={item} setMode={setMode} />

  return <EditItemRow item={item} setMode={setMode} />
}

export default ItemRow