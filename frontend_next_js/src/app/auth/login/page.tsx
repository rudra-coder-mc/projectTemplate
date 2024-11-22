"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // Custom button component
import AuthInput from "@/components/AuthInput";
import { toast } from "sonner"; // Toast notification
import { useRouter } from "next/navigation";
import axios, { AxiosResponse } from "axios";


const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // validate  input
      if (!email || !password) {
        toast.error("Email and password are required");
        setLoading(false);
        return;
      }
      // use axios
      const response: AxiosResponse = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log(response);

      if (response.status === 200) {
        toast.success("Login successful");
        setLoading(false);
        router.push("/");
      }
    } catch (error) {}
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <AuthInput
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <AuthInput
              label="Password"
              name="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>

          <div className="mt-4 text-center">
            <p className="text-gray-500">or</p>
            <Button
              onClick={() =>
                (window.location.href =
                  "http://localhost:8000/api/v1/users/google")
              }
              className="w-full mt-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Sign in with Google
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SigninPage;
