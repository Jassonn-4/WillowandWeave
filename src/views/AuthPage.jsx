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
    <div className="top-section">
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

      <div className="price-list">
          <h2>Price List</h2>

          <div className="category">
            <h3>Cut</h3>
            <p>Women's Haircut .................................. $60</p>
            <p>Men's Haircut ..................................... $50</p>
            <p>Child's Haircut .................................... $25</p>
            <p>Bang Trim ........................................... $15</p>
            <p className="note">(All cuts include wash & blowdry)</p>
          </div>

          <div className="category">
            <h3>Style</h3>
            <p>Blowout .................................................. $60</p>
            <p>Braids .................................................... $50</p>
            <p>Curls ....................................................... $25</p>
            <p>Straighten ............................................. $20</p>
            <p>Permanent Waves* ............................ $80</p>
          </div>

          <div className="flex-pricing">
            <div className="category">
              <h3>Color</h3>
              <p>All Over Color* ............................... $150</p>
              <p>Root Retouch .................................. $110</p>
              <p>Root Shadow .................................... $75</p>
              <p>Color Correction** ........................... $50</p>
            </div>

            <div className="category">
              <h3>Highlight</h3>
              <p>Full Highlight* .................................. $200</p>
              <p>Partial Highlight* ............................... $110</p>
              <p>Balayage* ............................................ $150</p>
              <p>Full "Halo"* ........................................ $100</p>
              <p>Half "Halo"* ....................................... $50</p>
              <p>Face Framing* ................................... $40</p>
            </div>
          </div>

          <p className="note">* Prices may vary on length of hair</p>
          <p className="note">** Prices may vary on severity of hair</p>
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