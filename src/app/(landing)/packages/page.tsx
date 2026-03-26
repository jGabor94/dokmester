import { buttonVariants } from '@/components/ui/btn'
import Wrapper from '@/components/Wrapper'
import { auth } from '@/features/authentication/lib/auth'
import { cn } from '@/lib/utils'
import { CheckCircleIcon, GemIcon, MonitorUpIcon, RocketIcon } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Csomagjaink - DokMester',
  description: 'Széleskörű rendszerünk minden vállalkozási formához igazodik. Válaszd ki a számodra legmegfelelőbb csomagot, hogy vállalkozásod újra hatékony lehessen!',
}

const PackagesPage = async () => {

  const session = await auth()

  return (
    <>
      <main>
        <header>
          <Wrapper className={`grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-4 mb-8 md:pt-24`}>
            <div>
              <h1 className={`text-center text-3xl md:text-start md:text-4xl lg:text-5xl font-bold mb-4 tracking-normal`}><span className={`text-primary`}>Válaszd ki</span> a hozzád illő csomagot, és <span className={`text-primary`}>tedd hatékonyabbá</span> céged!</h1>
              <p className={`text-center text-sm md:text-start md:text-base mb-8`}>Széleskörű rendszerünk minden vállalkozási formához igazodik. Válaszd ki a számodra legmegfelelőbb csomagot, hogy vállalkozásod újra hatékony lehessen!</p>
              <div className={`flex gap-4 items-center justify-center md:justify-start`}>
                <Link href={`/packages/#basic`} className={`${buttonVariants({ variant: 'default' })}`}>Tovább a csomagokhoz</Link>
              </div>
            </div>
            <div>
              <Image src={`/packages_hero.png`} width={2000} height={0} alt="Hero image" className={`w-full`} />
            </div>
          </Wrapper>
        </header>
      </main>
      <article>
        <section>
          <Wrapper className={`grid grid-cols-1 md:grid-cols-3 gap-x-4 items-start mb-8`}>
            <div id={`basic`} className={`pt-4`}>
              <div className={`border border-amber-500 rounded-2xl p-3 bg-amber-500/5 text-sm shadow-sm md:text-base`}>
                <h3 className={`text-base md:text-xl text-center mb-4`}>Basic Csomag </h3>
                <MonitorUpIcon className={`text-amber-500 size-16 shrink-0 mx-auto mb-4`} strokeWidth={1} />
                <p className={`font-bold text-amber-500 text-lg md:text-2xl text-center mb-3`}>1 490 Ft/hó</p>
                <div className={`border-t mb-3 border-amber-500`}></div>
                <p className={`font-bold text-sm md:text-base mb-2 text-center`}>Aki párszor használná</p>
                <ul className={`text-sm md:text-base ps-4 grid gap-3 mb-4`}>
                  <li className={`flex gap-3`}>
                    <CheckCircleIcon className={`text-amber-500`} />
                    <p>Személyre szabható arculat</p>
                  </li>
                  <li className={`flex gap-3`}>
                    <CheckCircleIcon className={`text-amber-500`} />
                    <p>Árajánlat, Díjbekérő kiállítása</p>
                  </li>
                  <li className={`flex gap-3`}>
                    <CheckCircleIcon className={`text-amber-500`} />
                    <p>Egyedi dokumentumok létrehozása</p>
                  </li>
                  <li className={`flex gap-3`}>
                    <CheckCircleIcon className={`text-amber-500`} />
                    <p>Dokumentumok mentése tárhelyre</p>
                  </li>
                </ul>
                <div className={`flex justify-center`}>
                  <Link href={session ? "/dashboard/options/subscription" : "/register"} className={`${cn(buttonVariants({ variant: 'default' }), 'bg-amber-500 hover:bg-amber-500/85')}`}>Ezt választom</Link>
                </div>
              </div>
            </div>
            <div id={`premium`} className={`pt-4`}>
              <div className={`border border-primary rounded-2xl p-3 bg-primary/5 text-sm shadow-sm md:text-base`}>
                <h3 className={`text-base md:text-xl text-center mb-4`}>Premium Csomag </h3>
                <RocketIcon className={`text-primary size-16 shrink-0 mx-auto mb-4`} strokeWidth={1} />
                <p className={`font-bold text-primary text-lg md:text-2xl text-center mb-3`}>2 490 Ft/hó</p>
                <div className={`border-t mb-3 border-primary`}></div>
                <p className={`font-bold text-sm md:text-base mb-2 text-center`}>Aki komolyan gondolja</p>
                <ul className={`text-sm md:text-base ps-4 grid gap-3 mb-4`}>
                  <li className={`flex gap-3`}>
                    <CheckCircleIcon className={`text-primary`} />
                    <p>Személyre szabható arculat</p>
                  </li>
                  <li className={`flex gap-3`}>
                    <CheckCircleIcon className={`text-primary`} />
                    <p>Árajánlat, Díjbekérő kiállítása</p>
                  </li>
                  <li className={`flex gap-3`}>
                    <CheckCircleIcon className={`text-primary`} />
                    <p>Egyedi dokumentumok létrehozása</p>
                  </li>
                  <li className={`flex gap-3`}>
                    <CheckCircleIcon className={`text-primary`} />
                    <p>Dokumentumok mentése tárhelyre</p>
                  </li>
                  <li className={`flex gap-3`}>
                    <CheckCircleIcon className={`text-primary`} />
                    <p>Partnerek felvitele, kezelése</p>
                  </li>
                  <li className={`flex gap-3`}>
                    <CheckCircleIcon className={`text-primary`} />
                    <p>Tételek felvitele, kezelése</p>
                  </li>
                  <li className={`flex gap-3`}>
                    <CheckCircleIcon className={`text-primary`} />
                    <p>10 felhasználó hozzáadása</p>
                  </li>
                  <li className={`flex gap-3`}>
                    <CheckCircleIcon className={`text-primary`} />
                    <p>Jogosultságok kezelése</p>
                  </li>
                  <li className={`flex gap-3`}>
                    <CheckCircleIcon className={`text-primary`} />
                    <p>Azonnali E-mail küldés</p>
                  </li>
                </ul>
                <div className={`flex justify-center`}>
                  <Link href={session ? "/dashboard/options/subscription" : "/register"} className={`${cn(buttonVariants({ variant: 'default' }))}`}>Ezt választom</Link>
                </div>
              </div>
            </div>
            <div id={`business`} className={`pt-4`}>
              <div className={`border border-violet-500 rounded-2xl p-3 bg-violet-500/5 text-sm shadow-sm md:text-base`}>
                <h3 className={`text-base md:text-xl text-center mb-4`}>Business Csomag</h3>
                <GemIcon className={`text-violet-500 size-16 shrink-0 mx-auto mb-4`} strokeWidth={1} />
                <p className={`font-bold text-violet-500 text-lg md:text-2xl text-center mb-3`}>3 990 Ft/hó</p>
                <div className={`border-t mb-3 border-violet-500`}></div>
                <p className={`font-bold text-sm md:text-base mb-2 text-center`}>Akinek a legjobb kell</p>
                <ul className={`text-sm md:text-base ps-4 grid gap-3 mb-4`}>
                  <li className={`flex gap-3`}>
                    <CheckCircleIcon className={`text-violet-500`} />
                    <p>Személyre szabható arculat</p>
                  </li>
                  <li className={`flex gap-3`}>
                    <CheckCircleIcon className={`text-violet-500`} />
                    <p>Árajánlat, Díjbekérő kiállítása</p>
                  </li>
                  <li className={`flex gap-3`}>
                    <CheckCircleIcon className={`text-violet-500`} />
                    <p>Egyedi dokumentumok létrehozása</p>
                  </li>
                  <li className={`flex gap-3`}>
                    <CheckCircleIcon className={`text-violet-500`} />
                    <p>Dokumentumok mentése tárhelyre</p>
                  </li>
                  <li className={`flex gap-3`}>
                    <CheckCircleIcon className={`text-violet-500`} />
                    <p>Partnerek felvitele, kezelése</p>
                  </li>
                  <li className={`flex gap-3`}>
                    <CheckCircleIcon className={`text-violet-500`} />
                    <p>Tételek felvitele, kezelése</p>
                  </li>
                  <li className={`flex gap-3`}>
                    <CheckCircleIcon className={`text-violet-500`} />
                    <p>20 felhasználó hozzáadása</p>
                  </li>
                  <li className={`flex gap-3`}>
                    <CheckCircleIcon className={`text-violet-500`} />
                    <p>Jogosultságok kezelése</p>
                  </li>
                  <li className={`flex gap-3`}>
                    <CheckCircleIcon className={`text-violet-500`} />
                    <p>Azonnali E-mail küldés</p>
                  </li>
                  <li className={`flex gap-3`}>
                    <CheckCircleIcon className={`text-violet-500`} />
                    <p>Munkavállalók felvitele, kezelése</p>
                  </li>
                  <li className={`flex gap-3`}>
                    <CheckCircleIcon className={`text-violet-500`} />
                    <p>Részletes analitika</p>
                  </li>
                </ul>
                <div className={`flex justify-center`}>
                  <Link href={session ? "/dashboard/options/subscription" : "/register"} className={`${cn(buttonVariants({ variant: 'default' }), 'bg-violet-500 hover:bg-violet-500')}`}>Ezt választom</Link>
                </div>
              </div>
            </div>
          </Wrapper>
        </section>
      </article>
    </>
  )
}

export default PackagesPage