"use client";

import {
  useSubmitReadingLogsModal,
  useUpdateBookDetailModal,
} from "@/utils/modal";
import { SubmitReadingLogsModal } from "@/components/SubmitReadingLogsModal";
import { UpdateBookDetailModal } from "@/components/UpdateBookDetailModal";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: isOpened } = useSubmitReadingLogsModal();
  const { data: updateModalIsOpened } = useUpdateBookDetailModal();

  return (
    <>
      {children}
      {isOpened && <SubmitReadingLogsModal />}
      {updateModalIsOpened && <UpdateBookDetailModal />}
    </>
  );
}
