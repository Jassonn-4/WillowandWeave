import React, { useState } from "react";
import CreateStylistProfile from "./CreateStylistProfile";
import { useNavigate } from "react-router-dom"
import StylistList from "./StylistList";
import Willow from '../assets/Willow.png'

export default function AuthPage() {
  const navigate = useNavigate();
  const handleCreateClick = () => {
    navigate("./CreateStylistProfile");
  };

  const handleCreateClick2 = () => {
    navigate("./LoginPage");
  };

  return (
    <>
      <div className="Header-Cont">
        <img src={Willow} alt="Willow and Weave" className="main-banner" />
        <div className="salon-info">
          <p> 295 Mobil Ave Ste 6 Camarillo, CA 93010 </p>
          <p> Monday - Friday</p>
          <p> hours: 8am - 7pm </p>
          <p>Weekends may vary depending on stylist</p>
          <p> For consultations contact stylists found on the cards below </p>
        </div>
      </div>

      <div className="StylistList-Cont">
      <StylistList />
      </div>

      <button className="bottom-left-button" onClick={handleCreateClick}>
        Create Account
      </button>
      <button className="bottom-left-button2" onClick={handleCreateClick2}>
        Login
      </button>
    </>
  );
}