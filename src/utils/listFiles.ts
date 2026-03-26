"server only"

import { FileObject } from '@supabase/storage-js';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_PROJECT_URL as string, process.env.SUPABASE_API_KEY as string)

export const listFiles = async (from: string, folder: string): Promise<FileObject[]> => {

  const { data, error } = await supabase.storage.from(from).list(folder)
  if (error) {
    console.log(error)
    throw error
  }
  if (!data) return []

  const listPromise = data.map((fileObject) => (async () => {
    if (fileObject.metadata === null) {
      return await listFiles(from, `${folder}/${fileObject.name}`)
    }

    return { ...fileObject, name: `${folder}/${fileObject.name}` }
  })())

  const list = await Promise.all(listPromise)

  return list.flat()
}