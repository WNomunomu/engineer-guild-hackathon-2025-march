import { useSWRStatic } from "./use-static-swr";

import type { SWRResponse } from "swr";

type SubmitReadingLogsModalStatus = {
  isOpened: boolean;
};

type SubmitReadingLogsModalStatusUtils = {
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
