import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Services from "../components/landing/Services";
import BikeShowcase from "../components/landing/BikeShowcase";
import Location from "../components/landing/Location";
import Contact from "../components/landing/Contact";
import Footer from "../components/landing/Footer";

const Landing = () => {
  return (
    <div className="font-sans">
      <Navbar />
      <Hero />
      <Services />
      <BikeShowcase />
      <Location />
      <Contact />
      <Footer />
    </div>
  );
};

export default Landing;
