import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";


const AboutLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default AboutLayout;