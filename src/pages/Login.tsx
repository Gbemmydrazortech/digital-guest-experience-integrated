
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import FormInput from "../components/FormInput";

type RegisteredUser = {
  name: string;
  email: string;
  password: string;
};

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!email.trim() || !password) {
      setMessage("Please complete all fields.");
      return;
    }

    try {
      const savedUsers = localStorage.getItem("grandstayUsers");

      const users: RegisteredUser[] = savedUsers
        ? JSON.parse(savedUsers)
        : [];

      if (!Array.isArray(users)) {
        setMessage("Unable to retrieve accounts. Please register again.");
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();

      const existingUser = users.find(
        (user) =>
          user.email?.toLowerCase() === normalizedEmail &&
          user.password === password
      );

      if (!existingUser) {
        setMessage("Invalid email or password. Please try again.");
        return;
      }

      const currentUser = {
        name: existingUser.name,
        email: existingUser.email,
      };

      localStorage.setItem(
        "grandstayCurrentUser",
        JSON.stringify(currentUser)
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
        <h1>Welcome Back</h1>
        <p>Sign in to your guest experience account.</p>

        <form onSubmit={handleLogin}>
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
            placeholder="Enter your password"
            onChange={setPassword}
            required
          />

          {message && (
            <p className="auth-message" role="alert">
              {message}
            </p>
          )}

          <Button type="submit">Sign In</Button>
        </form>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;

