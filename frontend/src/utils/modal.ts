import { useSWRStatic } from "./use-static-swr";

import type { SWRResponse } from "swr";

type SubmitReadingLogsModalStatus = {
  isOpened: boolean;
};

type SubmitReadingLogsModalStatusUtils = {
  open(): void;
  close(): void;
};

type UpdateBookDetailModalStatus = {
  isOpened: boolean;
};

type UpdateBookDetailModalStatusUtils = {
  open(): void;
  close(): void;
};

export const useSubmitReadingLogsModal = (): SWRResponse<
  SubmitReadingLogsModalStatus,
  Error
> &
  SubmitReadingLogsModalStatusUtils => {
  const initialStatus: SubmitReadingLogsModalStatus = { isOpened: false };
  const swrResponse = useSWRStatic<SubmitReadingLogsModalStatus, Error>(
    "submitReadingLogsModal",
    undefined,
    { fallbackData: initialStatus }
  );
  const { mutate } = swrResponse;

  const open = () => {
    mutate({ isOpened: true });
  };

  const close = () => {
    mutate({ isOpened: false });
  };

  return {
    ...swrResponse,
    open,
    close,
  };
};

export const useUpdateBookDetailModal = (): SWRResponse<
  UpdateBookDetailModalStatus,
  Error
> &
  UpdateBookDetailModalStatusUtils => {
  const initialStatus: UpdateBookDetailModalStatus = { isOpened: false };
  const swrResponse = useSWRStatic<UpdateBookDetailModalStatus, Error>(
    "updateBookDetailModal",
    undefined,
    { fallbackData: initialStatus }
  );
  const { mutate } = swrResponse;

  const open = () => {
    mutate({ isOpened: true });
  };

  const close = () => {
    mutate({ isOpened: false });
  };

  return {
    ...swrResponse,
    open,
    close,
  };
};
