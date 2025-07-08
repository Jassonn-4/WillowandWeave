import React, { useEffect, useState } from "react";
import  supabase  from "../lib/supabaseClient";
import ProfileCard from "./ProfileCard";
import "../StylistList.css";

const StylistList = () => {
    const [stylists, setStylists] = useState([]);
  
    useEffect(() => {
      const fetchStylists = async () => {
        const { data, error } = await supabase.from("stylists").select("*");
        if (error) {
          console.error("Error fetching stylists:", error);
        } else {
          setStylists(data);
        }
      };
  
      fetchStylists();
    }, []);
  
    return (
      <div className="stylist-list">
        {stylists.map((stylist) => (
          <ProfileCard
            key={stylist.id}
            id={stylist.id}
            name={stylist.name}
            title={stylist.stylists_number}
            avatarUrl={stylist.profile_url}
            iconUrl={stylist.profile_url}
            handle={stylist.bio}
            status={"Available"}
            contactText="Contact"
          />
        ))}
      </div>
    );
  };
  
  export default StylistList;