import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function useSignup(url) {
  const [error, setError] = useState(null);
  const { setUser } = useContext(AuthContext);

  const signup = async (userData) => {
    setError(null);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return null;
    }

    // Save user + JWT
    localStorage.setItem("user", JSON.stringify(data));

    // Update global AuthContext
    setUser(data);

    return data;
  };

  return { signup, error };
}
