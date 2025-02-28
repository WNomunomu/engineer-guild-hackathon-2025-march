"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/utils/auth-utils";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // ログイン処理
      await login({ email, password });
      router.push("/dashboard");

      // ログイン成功後にuseCurrentUserが更新される
    } catch (err) {
      console.log(err);
      setError("ログインに失敗しました");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow-lg"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">ログイン</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control form-original"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control form-original"
              required
            />
          </div>
          <button type="submit" className="btn btn-original w-100">
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
}
