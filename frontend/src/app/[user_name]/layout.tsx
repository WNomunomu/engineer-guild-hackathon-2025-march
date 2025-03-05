"use client";

import { useSubmitReadingLogsModal } from "@/utils/modal";
import { SubmitReadingLogsModal } from "@/components/SubmitReadingLogsModal";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: isOpened } = useSubmitReadingLogsModal();

  return (
    <>
      {children}
      {isOpened && <SubmitReadingLogsModal />}
    </>
  );
}
