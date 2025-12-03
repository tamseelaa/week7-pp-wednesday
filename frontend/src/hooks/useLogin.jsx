import { useState } from "react";

export default function useLogin(url) {
  const [error, setError] = useState(null);

  const login = async (info) => {
    setError(null);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(info),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return null;
    }

    localStorage.setItem("user", JSON.stringify(data));
    return data;
  };

  return { login, error };
}
