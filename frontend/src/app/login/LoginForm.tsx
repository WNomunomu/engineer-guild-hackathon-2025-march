"use client";

import { useState } from "react";
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
      await login({ email, password });

      // await mutate(); // 認証後にユーザーデータを再取得
      router.push("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("ログインに失敗しました");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        ログイン
      </button>
      {/* <button type="button" onClick={fetchHello}>ボタン</button> */}
    </form>
  );
}
