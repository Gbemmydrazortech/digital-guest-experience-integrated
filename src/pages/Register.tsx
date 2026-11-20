
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import FormInput from "../components/FormInput";

type RegisteredUser = {
  name: string;
  email: string;
  password: string;
};

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!name.trim() || !email.trim() || !password) {
      setMessage("Please complete all fields.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const savedUsers = localStorage.getItem("grandstayUsers");

      const users: RegisteredUser[] = savedUsers
        ? JSON.parse(savedUsers)
        : [];

      if (!Array.isArray(users)) {
        setMessage("Unable to retrieve accounts. Please try again.");
        return;
      }

      const existingUser = users.find(
        (user) => user.email?.toLowerCase() === normalizedEmail
      );

      if (existingUser) {
        setMessage("An account with this email already exists.");
        return;
      }

      const newUser: RegisteredUser = {
        name: name.trim(),
        email: normalizedEmail,
        password,
      };

      users.push(newUser);

      localStorage.setItem(
        "grandstayUsers",
        JSON.stringify(users)
      );

      localStorage.setItem(
        "grandstayCurrentUser",
        JSON.stringify({
          name: newUser.name,
          email: newUser.email,
        })
      );

      window.dispatchEvent(new Event("grandstayAuthChange"));

      navigate("/", { replace: true });
    } catch {
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Create Account</h1>
        <p>Join us for a better hotel experience.</p>

        <form onSubmit={handleRegister}>
          <FormInput
            label="Full Name"
            name="name"
            value={name}
            placeholder="Your full name"
            onChange={setName}
            required
          />

          <FormInput
            label="Email Address"
            name="email"
            type="email"
            value={email}
            placeholder="you@example.com"
            onChange={setEmail}
            required
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            value={password}
            placeholder="At least 6 characters"
            onChange={setPassword}
            required
          />

          {message && (
            <p className="auth-message" role="alert">
              {message}
            </p>
          )}

          <Button type="submit">Create Account</Button>
        </form>

        <p>
          Already registered? <Link to="/login">Sign In</Link>
        </p>
      </section>
    </main>
  );
}

export default Register;
