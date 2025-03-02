"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/utils/auth-utils";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      router.push(`/${name}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "サインアップに失敗しました"
      );
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow-lg"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">新規登録</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control form-control-original"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control form-control-original"
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
              className="form-control form-control-original"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="passwordConfirmation" className="form-label">
              Password Confirmation
            </label>
            <input
              type="password"
              id="passwordConfirmation"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="form-control form-control-original"
              required
            />
          </div>
          <button type="submit" className="btn btn-original w-100">
            サインアップ
          </button>
        </form>
      </div>
    </div>
  );
}
