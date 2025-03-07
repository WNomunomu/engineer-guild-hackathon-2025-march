"use client";

import { useState, useEffect } from "react";
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
    if (isCollapsed) {
      setIsCollapsed(false);
    }
    setShowLogout(!showLogout);
  };

  useEffect(() => {
    if (!user_name) {
      setShowLogout(false);
    }
  }, [user_name]);

  return (
    <div
      className={`
        d-flex flex-column flex-shrink-0 p-3 position-relative 
        text-white ${isCollapsed ? "sidebar-collapsed" : "sidebar-expanded"}
      `}
    >
      <div className="d-flex justify-content-end">
        {/* アプリケーションタイトル */}
        {!isCollapsed && (
          <h3 className="text-center">
            <Link
              href={user_name ? `/${user_name}` : "/"}
              className="text-white text-decoration-none"
            >
              HackBook
            </Link>
          </h3>
        )}
        {/* サイドバー折りたたみボタン */}
        <a
          className="text-light m-2 z-3 hover-element cursor-pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <span className="material-symbols-outlined">
            {isCollapsed ? "chevron_right" : "chevron_left"}
          </span>
        </a>
      </div>

      {/* ナビゲーションメニュー */}
      <ul
        className={`
        nav nav-pills flex-column mb-auto 
        ${isCollapsed ? "text-center" : ""}
        ${isCollapsed ? "mt-5" : ""}
      `}
      >
        {user_name ? (
          <>
            <NavItem
              href={`/${user_name}/add_book`}
              icon="book"
              label="本を追加"
              isCollapsed={isCollapsed}
            />
            <NavItem
              href={`/${user_name}/books`}
              icon="menu_book"
              label="本を見る"
              isCollapsed={isCollapsed}
            />
            <NavItem
              href={`/${user_name}/reading_logs`}
              icon="history_edu"
              label="読書ログを見る"
              isCollapsed={isCollapsed}
            />
            <NavItem
              href={`/${user_name}/exp_logs`}
              icon="military_tech"
              label="レベルを見る"
              isCollapsed={isCollapsed}
            />
          </>
        ) : (
          <>
            <NavItem
              href="/login"
              icon="login"
              label="ログイン"
              isCollapsed={isCollapsed}
            />
            <NavItem
              href="/signup"
              icon="person_add"
              label="新規登録"
              isCollapsed={isCollapsed}
            />
          </>
        )}
      </ul>

      {/* ユーザーセクション */}
      {user_name && (
        <div
          className={`
            position-absolute bottom-0 start-50 translate-middle-x 
            text-center mb-3 pointer
          `}
          onClick={handleUserIconClick}
        >
          <Image
            src="/bird_fukurou_run.png"
            alt="User Icon"
            className="rounded-circle mb-2"
            width={70}
            height={70}
          />
        </div>
      )}

      {/* ログアウトボタン */}
      {user_name && showLogout && (
        <button
          className="btn btn-danger position-absolute bottom-0 mb-3 rounded-circle"
          style={{
            width: "50px",
            height: "50px",
            // 折りたたみ時と展開時で異なる位置に配置
            left: isCollapsed ? "90px" : "calc(50% + 80px)",
            transform: isCollapsed ? "none" : "translateX(-50%)",
          }}
          onClick={handleLogout}
        >
          <span className="material-symbols-outlined text-white">logout</span>
        </button>
      )}

      <style jsx>{`
        .sidebar-expanded {
          width: 250px;
          background-color: #249474;
          transition: width 0.3s ease-in-out;
        }
        .sidebar-collapsed {
          width: 80px;
          background-color: #249474;
          transition: width 0.3s ease-in-out;
        }
        .pointer {
          cursor: pointer;
        }
        .material-symbols-outlined {
          font-size: 24px;
        }
      `}</style>
    </div>
  );
};

// ナビゲーションアイテムのコンポーネント
const NavItem = ({
  href,
  icon,
  label,
  isCollapsed,
}: {
  href: string;
  icon: string;
  label: string;
  isCollapsed: boolean;
}) => (
  <li className="nav-item mb-2">
    <Link
      href={href}
      className={`
        nav-link text-white d-flex align-items-center 
        ${isCollapsed ? "justify-content-center" : "justify-content-start"}
      `}
    >
      <span className="material-symbols-outlined me-2">{icon}</span>
      {!isCollapsed && <span>{label}</span>}
    </Link>
  </li>
);

export default Sidebar;
