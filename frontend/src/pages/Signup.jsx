import useField from "../hooks/useField";
import useSignup from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const name = useField("text");
  const email = useField("email");
  const password = useField("password");
  const phoneNumber = useField("text");
  const gender = useField("text");
  const dateOfBirth = useField("date");
  const membershipStatus = useField("text");

  const { signup, error } = useSignup("/api/users/signup");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const data = await signup({
      name: name.value,
      email: email.value,
      password: password.value,
      phone_number: phoneNumber.value,
      gender: gender.value,
      date_of_birth: dateOfBirth.value,
      membership_status: membershipStatus.value,
    });

    if (data) navigate("/");
  };

  return (
    <div className="create">
      <h2>Signup</h2>

      <form onSubmit={handleFormSubmit}>
        <label>Name:</label>
        <input {...name} />

        <label>Email:</label>
        <input {...email} />

        <label>Password:</label>
        <input {...password} type="password" />

        <label>Phone Number:</label>
        <input {...phoneNumber} />

        <label>Gender:</label>
        <input {...gender} />

        <label>Date of Birth:</label>
        <input {...dateOfBirth} />

        <label>Membership Status:</label>
        <input {...membershipStatus} />

        <button>Sign Up</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default Signup;
