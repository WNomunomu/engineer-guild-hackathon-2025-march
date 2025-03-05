"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { logout } from "@/utils/auth-utils";
import { useRouter, useParams } from "next/navigation";

export const Sidebar = () => {
  const [showLogout, setShowLogout] = useState(false);

  const router = useRouter();
  const { user_name } = useParams();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/"); // ログアウト成功時にリダイレクト
    } catch (error) {
      console.error("ログアウトに失敗しました", error);
    }
  };

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 position-relative"
      style={{
        width: "250px",
        minHeight: "100vh",
        backgroundColor: "#249474",
        overflowY: "auto",
      }}
    >
      <h3 className="text-center mb-3 text-white">
        <Link
          href={user_name ? `/${user_name}` : "/"}
          className="text-white text-decoration-none"
        >
          HackBook
        </Link>
      </h3>
      <ul className="nav nav-pills flex-column mb-auto">
        {user_name ? (
          <>
            <li className="nav-item">
              <Link
                href={`/${user_name}/add_book`}
                className="nav-link text-white d-flex align-items-center hover-element"
              >
                <span className="material-symbols-outlined fs-5 me-2">
                  book
                </span>
                本を追加
              </Link>
            </li>
            <li>
              <Link
                href={`/${user_name}/books`}
                className="nav-link text-white d-flex align-items-center hover-element"
              >
                <span className="material-symbols-outlined fs-5 me-2">
                  menu_book
                </span>
                本を見る
              </Link>
            </li>
            <li>
              <Link
                href={`/${user_name}/reading_logs`}
                className="nav-link text-white d-flex align-items-center hover-element"
              >
                <span className="material-symbols-outlined fs-5 me-2">
                  history_edu
                </span>
                読書ログを見る
              </Link>
            </li>
            <li>
              <Link
                href={`/${user_name}/exp_logs`}
                className="nav-link text-white d-flex align-items-center hover-element"
              >
                <span className="material-symbols-outlined fs-5 me-2">
                  military_tech
                </span>
                レベルを見る
              </Link>
            </li>
            <li>
              <Link
                href={`/${user_name}/progress`}
                className="nav-link text-white d-flex align-items-center hover-element"
              >
                <span className="material-symbols-outlined fs-5 me-2">
                  edit_note
                </span>
                読書記録する
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                href="/login"
                className="nav-link text-white d-flex align-items-center hover-element"
              >
                <span className="material-symbols-outlined fs-5 me-2">
                  login
                </span>
                ログイン
              </Link>
            </li>
            <li>
              <Link
                href="/signup"
                className="nav-link text-white d-flex align-items-center hover-element"
              >
                <span className="material-symbols-outlined fs-5 me-2">
                  person_add
                </span>
                新規登録
              </Link>
            </li>
          </>
        )}
      </ul>

      {/* ユーザーアイコンとログアウトボタン（ログイン時のみ表示） */}
      {user_name && (
        <div
          className="position-absolute d-flex align-items-center"
          style={{
            bottom: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            cursor: "pointer",
          }}
          onClick={() => setShowLogout(!showLogout)}
        >
          <Image
            src="/globe.svg"
            alt="User Icon"
            className="rounded-circle"
            width={40}
            height={40}
          />
        </div>
      )}

      {/* ログアウトボタン（ログイン時のみ表示） */}
      {user_name && showLogout && (
        <button
          className="position-absolute btn btn-danger d-flex align-items-center justify-content-center"
          style={{
            bottom: "10px",
            left: "calc(50% + 80px)",
            transform: "translateX(-50%)",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            padding: "5px",
          }}
          onClick={handleLogout}
        >
          <span className="material-symbols-outlined text-white">logout</span>
        </button>
      )}
    </div>
  );
};
