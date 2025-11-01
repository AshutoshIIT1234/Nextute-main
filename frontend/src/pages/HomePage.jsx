import React, { Suspense, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Ad from "../components/Ad";
import Test from "../components/Test";
import SearchTest from "../components/SearchTest";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
const Testimonial = React.lazy(() => import("../components/Testimonial"));

const HomePage = () => {
  const { setUserLocation } = useContext(AppContext);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Geolocation error or denied", error);
          setUserLocation(null); // fallback to default
        }
      );
    } else {
      console.warn("Geolocation not supported");
      setUserLocation(null);
    }
  }, []);

  return (
    <div className="w-full overflow-x-hidden bg-white">
      <Navbar />
      <Header />
      <Ad />
      <Suspense fallback={<div style={{minHeight:200}}>Loading testimonials...</div>}>
        <Testimonial />
      </Suspense>
      <Test />
      <SearchTest />
      <Footer />
    </div>
  );
};

export default HomePage;