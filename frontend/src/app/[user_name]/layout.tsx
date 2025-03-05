"use client";

import { useSubmitReadingLogsModal } from "@/utils/modal";
import { SubmitReadingLogsModal } from "@/components/SubmitReadingLogsModal";

export default function UserLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { "user-name": string };
}) {
  const { data: isOpened } = useSubmitReadingLogsModal();

  return (
    <>
      {children}
      {isOpened && <SubmitReadingLogsModal />}
    </>
  );
}
