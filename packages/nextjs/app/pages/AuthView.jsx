"use client";

import React, { useState } from "react";
import StarkenLogo from "../../components/StarkenLogo";

const AuthView = ({ onAuth }) => {
  const [authView, setAuthView] = useState("login"); // 'login', 'signup', 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [forgotEmail, setForgotEmail] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      onAuth();
      setLoginData({ email: "", password: "" });
      alert("Login successful!");
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (
      signupData.name &&
      signupData.email &&
      signupData.password &&
      signupData.confirmPassword
    ) {
      if (signupData.password !== signupData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      onAuth();
      setSignupData({ name: "", email: "", password: "", confirmPassword: "" });
      alert("Account created successfully!");
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (forgotEmail) {
      alert(`Password reset link sent to ${forgotEmail}`);
      setForgotEmail("");
      setAuthView("login");
    } else {
      alert("Please enter your email");
    }
  };

  return (
    <div className="min-h-screen bg-[#232323] flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-md sm:max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <StarkenLogo />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Starken</h1>
          <p className="text-gray-400">Gaming NFT Marketplace</p>
        </div>

        <div className="bg-[#232323] rounded-2xl p-8 border border-gray-800 shadow-lg">
          {/* Login Form */}
          {authView === "login" && (
            <form onSubmit={handleLogin}>
              <h2 className="text-2xl font-bold text-white mb-6">Login</h2>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-4 pr-4 py-3 text-white focus:outline-none focus:border-blue-600"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-400 text-sm mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-4 pr-12 py-3 text-white focus:outline-none focus:border-blue-600"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAuthView("forgot")}
                className="text-blue-400 hover:text-blue-300 text-sm mb-6 block"
              >
                Forgot Password?
              </button>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold mb-4"
              >
                Login
              </button>
              <p className="text-center text-gray-400 text-sm">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setAuthView("signup")}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Sign Up
                </button>
              </p>
            </form>
          )}
          {/* Signup Form */}
          {authView === "signup" && (
            <form onSubmit={handleSignup}>
              <h2 className="text-2xl font-bold text-white mb-6">Sign Up</h2>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={signupData.name}
                  onChange={(e) =>
                    setSignupData({ ...signupData, name: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-4 pr-4 py-3 text-white focus:outline-none focus:border-blue-600"
                  placeholder="Enter your name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-4 pr-4 py-3 text-white focus:outline-none focus:border-blue-600"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-4 pr-12 py-3 text-white focus:outline-none focus:border-blue-600"
                    placeholder="Create password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-400 text-sm mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={signupData.confirmPassword}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-4 pr-4 py-3 text-white focus:outline-none focus:border-blue-600"
                  placeholder="Confirm password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold mb-4"
              >
                Create Account
              </button>
              <p className="text-center text-gray-400 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setAuthView("login")}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Login
                </button>
              </p>
            </form>
          )}
          {/* Forgot Password Form */}
          {authView === "forgot" && (
            <form onSubmit={handleForgotPassword}>
              <h2 className="text-2xl font-bold text-white mb-2">
                Forgot Password
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Enter your email to receive a password reset link
              </p>
              <div className="mb-6">
                <label className="block text-gray-400 text-sm mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-4 pr-4 py-3 text-white focus:outline-none focus:border-blue-600"
                  placeholder="Enter your email"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold mb-4"
              >
                Send Reset Link
              </button>
              <button
                type="button"
                onClick={() => setAuthView("login")}
                className="w-full text-gray-400 hover:text-white text-sm"
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthView;
