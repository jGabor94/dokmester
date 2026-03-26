import { Button } from "@/components/ui/btn"
import { Input } from "@/components/ui/inpt"

const SearchForm = () => {
  return (
    <form className={`flex gap-4`}>
      <select name="type" className={`block`}>
        <option value={'0'}>Típus</option>
      </select>
      <Input type={`text`} placeholder={`Keresés`} className={`block`} />
      <Button type={`submit`}>Keresés</Button>
    </form>
  )
}

export default SearchForm