import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import person from '../assets/carsisitadpic.jpg'
import logo from '../assets/carsisstlogo.png'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // handle login logic here
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel: Form ── */}
      <div className="w-full md:w-[45%] flex flex-col px-10 py-8 bg-white">
        {/* Logo */}
        <div className="flex items-center gap-1.5 mb-16">
        <img src={logo} alt="Logo" className="h-20 w-auto" />
        </div>

        {/* Form */}
        <div className="flex-1 flex flex-col justify-center max-w-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Login</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Lorem lorem"
                className="w-full px-0 py-2 text-sm text-gray-700 placeholder-gray-400 border-0 border-b-2 border-red-500 focus:outline-none focus:border-blue-500 transition-colors bg-transparent"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter your Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Type your password here"
                  className="w-full px-0 py-2 pr-8 text-sm text-gray-700 placeholder-gray-400 border-0 border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-md bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-semibold transition-colors"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="hidden md:block w-1.5 bg-blue-500 shrink-0" />

      {/* ── Right Panel: Illustration ── */}
      <div className="hidden md:block flex-1 bg-slate-100 overflow-hidden">
        <img
          src={person}
          alt="Person working at a laptop"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;