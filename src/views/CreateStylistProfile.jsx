import React, { useState } from "react";
import { createStylist } from "../viewmodels/useCreateStylist";
import  supabase  from "../lib/supabaseClient"
import { useNavigate } from "react-router-dom"
import heic2any from "heic2any";

export default function CreateStylistProfile() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        bio: "",
        created_at: "",
        stylists_number: "",
        skills: "",
        staffSecret: "",
    });

const [profileImage, setProfileImage] = useState(null);
const [QrImage, setQRImage] = useState(null);
const [message, setMessage] = useState("");

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
};

const handleImageChange2 = (e) => {
    setQRImage(e.target.files[0]);
}

const uploadImage = async (file) => {
    let uploadFile = file;
    let fileExt = file.name.split('.').pop().toLowerCase();
    let fileName = file.name;

    if (fileExt === "heic") {
        try {
          const convertedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.8,
          });
    
          uploadFile = new File([convertedBlob], file.name.replace(/\.heic$/, ".jpg"), {
            type: "image/jpeg",
          });
    
          fileExt = "jpg";
          fileName = uploadFile.name;
        } catch (error) {
          console.error("Failed to convert HEIC:", error);
          throw error;
        }
      }

    const filePath = `${Date.now()}-${fileName}`;

    const { data, error } = await supabase.storage
        .from("profile-images")
        .upload(filePath, uploadFile);

    if (error) throw error;

    const { data: urlData } = supabase.storage
        .from("profile-images")
        .getPublicUrl(filePath);
    
    return urlData.publicUrl;
}

const handleSubmit = async (e) => {
    e.preventDefault();

    const STAFF_SECRET = import.meta.env.VITE_STYLIST_SECRET;
    if (formData.staffSecret !== STAFF_SECRET) {
        setMessage("Invalid staff secret - you are not authorized to make an account.");
        return;
    }

    try {
        const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

        const created_at = new Date().toISOString();

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
        })
        if (authError) {
            throw authError;
        }

        const { data: userData } = await supabase.auth.getUser();
        console.log("Current user:", userData?.user);

    let profile_url = "";
    if (profileImage) {
        try {
        console.log("uploading profile image...", profileImage);
        profile_url = await uploadImage(profileImage);
        } catch (uploadError) {
            console.error("Image upload failed:", uploadError.message);
            setMessage("Image upload failed");
            return;
        }
    }

    let QR_url = "";
    if (QrImage) {
        try {
            console.log("uploading QR code...", QrImage);
            QR_url = await uploadImage(QrImage);
        } catch (uploadError) {
            console.error("Image upload failed:", uploadError.message);
            setMessage("Image upload failed");
            return;
        }
    }

    const userId = userData?.user.id;

    console.log("Sending stylist data to backend...");
    await createStylist({
        name: formData.name,
        bio: formData.bio,
        stylists_number: formData.stylists_number,
        id: userId,
        created_at,
        skills: skillsArray,
        profile_url,
        QR_url,
    });

    setMessage("Stylist profile created successfully!");
    } catch (error) {
        console.error("Error:", error.message);
        setMessage("Failed to create stylist profile.");
    }
};

const navigate = useNavigate();
  const handleCreateClick = () => {
    navigate("/");
  };

return (
    <>
    <div className="form-wrapper">
        <div className="form-card">
        <h2>Create Stylist Profile</h2>
        <form onSubmit={handleSubmit}>
        <div className="two-col">
            <input name="email" placeholder="Email" onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
            <input name="name" placeholder="Name" onChange={handleChange} required />
            <input name="skills" placeholder="Skills (comma separated)" onChange={handleChange} />
            <input name="stylists_number" placeholder="phone #" onChange={handleChange} />
            <textarea name="bio" placeholder="Instagram handle" onChange={handleChange} />
            <input name="staffSecret" placeholder="Staff Password" onChange={handleChange} required />
            <label htmlFor="profilePic" className="label">Upload Profile Picture</label>
            <input type="file" id="profilePic" accept="image/*" onChange={handleImageChange} />
            <label htmlFor="QRpic" className="label"> Upload QR Code SC</label>
            <input type="file" id="QRpic" accept="image/*" onChange={handleImageChange2} />
            <button type="submit">Create Profile</button>
            </div>
      </form>
      {message && <p>{message}</p>}
        </div>
    </div>
    <button className="bottom-left-button" onClick={handleCreateClick}> Go Back </button>
    </>
  );
}