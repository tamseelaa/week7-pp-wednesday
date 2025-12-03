import useField from "../hooks/useField";
import useLogin from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const email = useField("email");
  const password = useField("password");

  const { login, error } = useLogin("/api/users/login");
  const { setUser } = useContext(AuthContext);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const data = await login({
      email: email.value,
      password: password.value,
    });

    if (data) {
      setUser(data);
      console.log("LOGIN SUCCESS");
      navigate("/");
    }
  };

  return (
    <div className="create">
      <h2>Login</h2>
      <form onSubmit={handleFormSubmit}>
        <label>Email address:</label>
        <input {...email} />

        <label>Password:</label>
        <input {...password} />

        <button>Login</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
