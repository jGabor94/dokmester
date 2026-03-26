import Wrapper from "@/components/Wrapper"
import Link from "next/link"

const Footer = () => {
  return (
    <>
      <footer className={`bg-primary text-primary-foreground text-sm w-full`}>
        <Wrapper className={`p-4 pb-24 md:pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4`}>
          <div>
            <p className={`font-bold mb-2`}>Hasznos linkek</p>
            <ul className={`ps-3`}>
              <li><Link href={``}>Kezdőlap</Link></li>
              <li><Link href={`/login`}>Bejelentkezés</Link></li>
              <li><Link href={`/register`}>Regisztráció</Link></li>
            </ul>
          </div>
          <div>
            <p className={`font-bold mb-2`}>Céges adatok</p>
            <ul className={`ps-3`}>
              <li>Név: Janó Richárd e.v.</li>
              <li>Székhely: 8131 Enying, Fő utca 100.</li>
              <li>Adószám: 59691154-1-27</li>
            </ul>
          </div>
          <div>
            <p className={`font-bold mb-2`}>Elérhetőségek</p>
            <ul className={`ps-3`}>
              <li>E-mail: info@dokmester.com</li>
            </ul>
          </div>
        </Wrapper>
      </footer>
    </>
  )
}

export default Footer