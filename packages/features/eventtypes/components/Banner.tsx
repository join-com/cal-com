import classNames from "classnames";
import { useMemo } from "react";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc";
import { FiCalendar, FiAlertCircle } from "@calcom/ui/components/icon";

interface BannerData {
  title: string;
  description: string[];
}

export const Banner = () => {
  const { t } = useLocale();

  const {
    data: calendars,
    isLoading: isLoadingCalendars,
    error: errorCalendar,
  } = trpc.viewer.connectedCalendars.useQuery();
  const {
    data: defaultVideoApp,
    isLoading: isLoadingVideo,
    error: errorVideo,
  } = trpc.viewer.getUsersDefaultConferencingApp.useQuery();

  const isSuccessBanner =
    calendars?.connectedCalendars && calendars.connectedCalendars.length > 0 && defaultVideoApp?.appSlug;

  const { title, description } = useMemo(() => {
    if (isSuccessBanner) {
      return {
        title: "successModal_title",
        description: ["successModal_description"],
      };
    }

    const data: BannerData = { title: "improveModal_title", description: [] };

    if (calendars?.connectedCalendars.length === 0) {
      data.description.push("improveModal_connectCalendar");
    }

    if (!defaultVideoApp?.appSlug) {
      data.description.push("improveModal_connectConferencing");
    }

    return data;
  }, [isSuccessBanner, calendars?.connectedCalendars, defaultVideoApp?.appSlug]);

  if (isLoadingCalendars || isLoadingVideo || errorCalendar || errorVideo) {
    return null;
  }

  return (
    <div
      className={classNames(
        "border-neutral-150 mb-8 flex rounded-md border bg-neutral-50 py-6 px-7",
        isSuccessBanner ? "bg-green-50" : "bg-neutral-50"
      )}>
      {isSuccessBanner ? (
        <FiCalendar className="mt-1 mr-5 text-green-700" size="24px" />
      ) : (
        <FiAlertCircle className="mt-1 mr-5 text-neutral-700" size="24px" />
      )}
      <div>
        <h4 className="font-cal text-lg font-semibold text-neutral-700">{t(title)}</h4>
        <span className="text-sm text-neutral-600">{description.map((item) => `${t(item)} `)}</span>
      </div>
    </div>
  );
};
