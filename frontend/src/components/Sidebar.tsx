"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { logout } from "@/utils/auth-utils";

export const Sidebar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const { user_name } = useParams();

  const handleLogout = async () => {
    try {
      await logout();
      setShowLogout(false);
      router.push("/");
    } catch (error) {
      console.error("ログアウトに失敗しました", error);
    }
  };

  const handleUserIconClick = () => {
    // If sidebar is collapsed, open it
    if (isCollapsed) {
      setIsCollapsed(false);
    }
    // Toggle logout button visibility
    setShowLogout(!showLogout);
  };

  useEffect(() => {
    if (!user_name) {
      setShowLogout(false);
    }
  }, [user_name]);

  return (
    <div
      className={
        "d-flex flex-column flex-shrink-0 p-3 position-relative transition-all"
      }
      style={{
        width: isCollapsed ? "80px" : "250px",
        minHeight: "100vh",
        backgroundColor: "#249474",
        overflowY: "auto",
        transition: "width 0.3s ease-in-out",
      }}
    >
      {/* 折りたたみトグルボタン */}
      <button
        className="btn btn-light position-absolute"
        style={{
          top: "10px",
          right: isCollapsed ? "10px" : "-20px",
          zIndex: 1000,
          transition: "right 0.3s ease-in-out",
        }}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="material-symbols-outlined">
          {isCollapsed ? "chevron_right" : "chevron_left"}
        </span>
      </button>

      <h3
        className={`text-center mb-3 text-white ${isCollapsed ? "d-none" : ""}`}
      >
        <Link
          href={user_name ? `/${user_name}` : "/"}
          className="text-white text-decoration-none"
        >
          HackBook
        </Link>
      </h3>

      <ul
        className="nav nav-pills flex-column mb-auto"
        style={{
          marginTop: isCollapsed ? "50px" : "0", // Add margin when collapsed
          transition: "margin-top 0.3s ease-in-out",
        }}
      >
        {user_name ? (
          <>
            <li className="nav-item">
              <Link
                href={`/${user_name}/add_book`}
                className={`nav-link text-white d-flex align-items-center hover-element ${
                  isCollapsed ? "justify-content-center" : ""
                }`}
              >
                <span className="material-symbols-outlined fs-5 me-2">
                  book
                </span>
                {!isCollapsed && "本を追加"}
              </Link>
            </li>
            <li>
              <Link
                href={`/${user_name}/books`}
                className={`nav-link text-white d-flex align-items-center hover-element ${
                  isCollapsed ? "justify-content-center" : ""
                }`}
              >
                <span className="material-symbols-outlined fs-5 me-2">
                  menu_book
                </span>
                {!isCollapsed && "本を見る"}
              </Link>
            </li>
            <li>
              <Link
                href={`/${user_name}/reading_logs`}
                className={`nav-link text-white d-flex align-items-center hover-element ${
                  isCollapsed ? "justify-content-center" : ""
                }`}
              >
                <span className="material-symbols-outlined fs-5 me-2">
                  history_edu
                </span>
                {!isCollapsed && "読書ログを見る"}
              </Link>
            </li>
            <li>
              <Link
                href={`/${user_name}/exp_logs`}
                className={`nav-link text-white d-flex align-items-center hover-element ${
                  isCollapsed ? "justify-content-center" : ""
                }`}
              >
                <span className="material-symbols-outlined fs-5 me-2">
                  military_tech
                </span>
                {!isCollapsed && "レベルを見る"}
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                href="/login"
                className={`nav-link text-white d-flex align-items-center hover-element ${
                  isCollapsed ? "justify-content-center" : ""
                }`}
              >
                <span className="material-symbols-outlined fs-5 me-2">
                  login
                </span>
                {!isCollapsed && "ログイン"}
              </Link>
            </li>
            <li>
              <Link
                href="/signup"
                className={`nav-link text-white d-flex align-items-center hover-element ${
                  isCollapsed ? "justify-content-center" : ""
                }`}
              >
                <span className="material-symbols-outlined fs-5 me-2">
                  person_add
                </span>
                {!isCollapsed && "新規登録"}
              </Link>
            </li>
          </>
        )}
      </ul>

      {/* ユーザーアイコン（下部に固定） */}
      {user_name && (
        <div
          className="position-absolute d-flex align-items-center"
          style={{
            bottom: "5px",
            left: isCollapsed ? "10px" : "50%",
            transform: isCollapsed ? "none" : "translateX(-50%)",
            cursor: "pointer",
            transition: "left 0.3s ease-in-out, bottom 0.3s ease-in-out",
            marginBottom: isCollapsed ? "40px" : "0",
          }}
          onClick={handleUserIconClick}
        >
          <Image
            src="/bird_fukurou_run.png"
            alt="User Icon"
            className="rounded-circle"
            width={70}
            height={70}
          />
        </div>
      )}

      {/* ログアウトボタン */}
      {user_name && showLogout && (
        <button
          className="position-absolute btn btn-danger d-flex align-items-center justify-content-center"
          style={{
            bottom: "10px",
            left: isCollapsed ? "60px" : "calc(50% + 80px)",
            transform: isCollapsed ? "none" : "translateX(-50%)",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            padding: "5px",
            transition: "left 0.3s ease-in-out",
          }}
          onClick={handleLogout}
        >
          <span className="material-symbols-outlined text-white">logout</span>
        </button>
      )}
    </div>
  );
};
