import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import person from "../assets/carsisitadpic.jpg";
import logo from "../assets/carsisstlogo.png";
import axios from "../Config/axiosconfig";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post("/login", {
        email,
        password,
      });

    

      // Save token
      localStorage.setItem("token", data.data.token);

      // Save logged-in user if returned
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Redirect
      navigate("/admin/overview");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="w-full md:w-[45%] flex flex-col px-10 py-8 bg-white">
        <div className="flex items-center gap-1.5 mb-16">
          <img src={logo} alt="Logo" className="h-20 w-auto" />
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>

              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full px-0 py-2 border-b-2 border-red-500 focus:outline-none bg-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-0 py-2 pr-8 border-b border-gray-300 focus:outline-none bg-transparent"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      <div className="hidden md:block w-1.5 bg-blue-500" />

      <div className="hidden md:block flex-1 overflow-hidden">
        <img
          src={person}
          alt="Person"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;