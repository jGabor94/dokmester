import Wrapper from "@/components/Wrapper";
import { ArrowRightIcon, BikeIcon, CarIcon, ClockArrowDownIcon, ClockArrowUpIcon, FilesIcon, FileX2Icon, FrownIcon, GemIcon, MonitorUpIcon, PaletteIcon, PlaneTakeoffIcon, RocketIcon, ShapesIcon, ShieldCheckIcon, SnailIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/ui/navbar";
import { buttonVariants } from "@/components/ui/btn";
import { cn } from "@/lib/utils";
import Footer from "@/components/ui/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <header>
          <Wrapper className={`grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-4 mb-8 md:pt-24`}>
            <div>
              <h1 className={`text-center text-3xl md:text-start md:text-4xl lg:text-5xl font-bold mb-4 tracking-normal`}>Kezeld a vállalkozásod dokumentumait <span className={`text-primary`}>gyorsan</span> és <span className={`text-primary`}>egyszerűen</span>!</h1>
              <p className={`text-center text-sm md:text-start md:text-base mb-8`}>Céges dokumentum készítő webalkalmazás. Számlák, szállítólevelek, árajánlatok, és még sok más! Könnyen kezelhető bárhonnan, bármikor!</p>
              <div className={`flex gap-4 items-center justify-center md:justify-start`}>
                <Link href={`/login`} className={`${buttonVariants({variant: 'default'})}`}>Kipróbálom ingyen</Link>
                <Link href={`/#problem`} className={`${buttonVariants({variant: 'outline'})}`}>Tovább olvasok</Link>
              </div>
            </div>
            <div>
              <Image src={`/hero.png`} width={2000} height={0} alt="Hero image" className={`w-full`} />
            </div>
          </Wrapper>
        </header>
        <article>
          <section id="problem">
            <Wrapper className={`grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-4 mb-8 md:pt-24`}>
              <div className={`order-last md:order-first`}>
                <Image src={`/problem.png`} width={2000} height={0} alt="Hero image" className={`w-full`} />
              </div>
              <div className={``}>
                <h2 className={`text-2xl text-center md:text-3xl font-bold mb-6 tracking-normal`}>Túl sok lett a papírmunka!</h2>
                <ul className={`grid gap-3 mb-4`}>
                  <li className={`border border-rose-500 rounded-2xl p-3 bg-rose-500/5 flex justify-start items-center gap-3 text-sm shadow-sm md:text-base`}><ClockArrowDownIcon className={`text-rose-500 size-5 shrink-0 m-2`} />Sok időt elvesz a papírmunka, pedig lenne fontosabb dolgod is</li>
                  <li className={`border border-rose-500 rounded-2xl p-3 bg-rose-500/5 flex justify-start items-center gap-3 text-sm shadow-sm md:text-base`}><SnailIcon className={`text-rose-500 size-5 shrink-0 m-2`} />Nem tudod gyorsan előkeresni a régi szerződéseid vagy ajánlataid</li>
                  <li className={`border border-rose-500 rounded-2xl p-3 bg-rose-500/5 flex justify-start items-center gap-3 text-sm shadow-sm md:text-base`}><FileX2Icon className={`text-rose-500 size-5 shrink-0 m-2`} />Elveszett egy nagyon fontos dokumentum, nem tudod hova tűnt</li>
                  <li className={`border border-rose-500 rounded-2xl p-3 bg-rose-500/5 flex justify-start items-center gap-3 text-sm shadow-sm md:text-base`}><ShapesIcon className={`text-rose-500 size-5 shrink-0 m-2`} />A kiadott dokumentum nem tükrözi céged egyéniségét, minőségét</li>
                </ul>
                <div className={`flex justify-center items-center`}>
                  <Link href={`/#solution`} className={`${buttonVariants({variant: 'outline'})}`}>Változást szeretnék</Link>
                </div>
              </div>
            </Wrapper>
          </section>
          <section id="solution">
            <Wrapper className={`grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-4 md:pt-20`}>
              <div className={``}>
                <h2 className={`text-2xl text-center md:text-3xl font-bold mb-6 tracking-normal`}>Szerencsére itt a DokMester!</h2>
                <ul className={`grid gap-3 mb-4`}>
                  <li className={`border border-emerald-500 rounded-2xl p-3 bg-emerald-500/5 flex justify-start items-center gap-3 text-sm shadow-sm md:text-base`}><ClockArrowUpIcon className={`text-emerald-500 size-5 shrink-0 m-2`} />Segítünk vállalkozásod papírmunkáiban, hogy neked csak az igazán fontos dolgokkal kelljen foglalkoznod!</li>
                  <li className={`border border-emerald-500 rounded-2xl p-3 bg-emerald-500/5 flex justify-start items-center gap-3 text-sm shadow-sm md:text-base`}><ShieldCheckIcon className={`text-emerald-500 size-5 shrink-0 m-2`} />Dokumentumaid biztonságosan, bárhonnan és bármikor elérhetőek számodra, akár mobilon is!</li>
                  <li className={`border border-emerald-500 rounded-2xl p-3 bg-emerald-500/5 flex justify-start items-center gap-3 text-sm shadow-sm md:text-base`}><PaletteIcon className={`text-emerald-500 size-5 shrink-0 m-2`} />Kiállított dokumentumaid 100%-osan személyre szabhatóak, hogy tükrözzék céged professzionális megjelenését!</li>
                  <li className={`border border-emerald-500 rounded-2xl p-3 bg-emerald-500/5 flex justify-start items-center gap-3 text-sm shadow-sm md:text-base`}><FilesIcon className={`text-emerald-500 size-5 shrink-0 m-2`} />Céged tejles működésében is segítünk, legyen itt szó árajánlatról, szerződésekről, munkavállalók kezeléséről, partnerek nyilvántartásáról!</li>
                </ul>
                <div className={`flex justify-center items-center`}>
                  <Link href={`/#packages`} className={`${buttonVariants({variant: 'outline'})}`}>Vágjunk bele!</Link>
                </div>
              </div>
              <div>
                <Image src={`/solution.png`} width={2000} height={0} alt="Hero image" className={`w-full`} />
              </div>
              
            </Wrapper>
          </section>
          <section id="packages">
            <Wrapper className={`grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-4 mb-8 md:pt-24`}>
              <div className={`order-last md:order-first`}>
                <Image src={`/packages.png`} width={2000} height={0} alt="Hero image" className={`w-full`} />
              </div>
              <div className={``}>
                <h2 className={`text-2xl text-center md:text-3xl font-bold mb-6 tracking-normal`}>Csomagjaink</h2>
                <ul className={`grid gap-3 mb-4`}>
                  <li className={`border border-amber-500 rounded-2xl p-3 bg-amber-500/5 flex justify-start items-start gap-3 text-sm shadow-sm md:text-base`}>
                    <MonitorUpIcon className={`text-amber-500 size-5 shrink-0 m-2`} />
                    <div className={`flex justify-between items-end w-full gap-3`}>
                      <div>
                        <h3 className={`font-bold mb-2 text-base md:text-lg`}>Basic Csomag - 1 490 Ft/hó</h3>
                        <p className={`text-sm md:text-base`}>Tökéletes választás azok számára, akik minőségi dokumentumokat szeretnének kiadni a kezük közül.</p>
                      </div>
                      <div>
                        <Link href={`/packages#basic`} className={`${cn(buttonVariants({variant: 'default', size: 'icon'}), 'bg-amber-500 hover:bg-amber-500/85')}`}>
                          <ArrowRightIcon />
                        </Link>
                      </div>
                    </div>
                  </li>
                  <li className={`border border-primary rounded-2xl p-3 bg-primary/5 flex justify-start items-start shadow-sm gap-3 text-sm md:text-base`}>
                    <RocketIcon className={`text-primary size-5 shrink-0 m-2`} />
                    <div className={`flex justify-between items-end w-full gap-3`}>
                      <div>
                        <h3 className={`font-bold mb-2 text-base md:text-lg`}>Premium Csomag - 2 490 Ft/hó</h3>
                        <p className={`text-sm md:text-base`}>Tökéletes választás azok számára, akik a legtöbbet szeretnék kihozni cégük működtetéséből.</p>
                      </div>
                      <div>
                        <Link href={`/packages#premium`} className={`${cn(buttonVariants({variant: 'default', size: 'icon'}))}`}>
                          <ArrowRightIcon />
                        </Link>
                      </div>
                    </div>
                  </li>
                  <li className={`border border-violet-500 rounded-2xl p-3 bg-violet-500/5 flex justify-start items-start gap-3 text-sm shadow-sm md:text-base`}>
                    <GemIcon className={`text-violet-500 size-5 shrink-0 m-2`} />
                    <div className={`flex justify-between items-end w-full gap-3`}>
                      <div>
                        <h3 className={`font-bold mb-2 text-base md:text-lg`}>Business Csomag - 3 990 Ft/hó</h3>
                        <p className={`text-sm md:text-base`}>Tökéletes választás azok számára, akiknek elengedhetetlen a legsokoldalúbb rendszer vállalkozásuk irányításához.</p>
                      </div>
                      <div>
                        <Link href={`/packages#business`} className={`${cn(buttonVariants({variant: 'default', size: 'icon'}), 'bg-violet-500 hover:bg-violet-500/85')}`}>
                          <ArrowRightIcon />
                        </Link>
                      </div>
                    </div>
                  </li>
                </ul>
                <div className={`flex justify-center items-center`}>
                  <Link href={`/register`} className={`${buttonVariants({variant: 'default'})}`}>Regisztrálok</Link>
                </div>
              </div>
            </Wrapper>
          </section>
        </article>
        <Footer />
      </main>
    </>
  );
}
