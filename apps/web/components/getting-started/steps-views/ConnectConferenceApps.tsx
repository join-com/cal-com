import { ArrowRightIcon } from "@heroicons/react/solid";

import classNames from "@calcom/lib/classNames";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import { SkeletonAvatar, SkeletonText, SkeletonButton, List } from "@calcom/ui";

import { ConferenceAppItem } from "@components/getting-started/components/ConferenceAppItem";

interface IConnectCalendarsProps {
  nextStep: () => void;
}

const ConnectConferenceApps = (props: IConnectCalendarsProps) => {
  const { nextStep } = props;
  const queryConnectedCalendars = trpc.viewer.connectedCalendars.useQuery();
  const { t } = useLocale();
  const queryIntegrations = trpc.viewer.integrations.useQuery({
    variant: "conferencing",
  });

  return (
    <>
      <List className="mx-1 divide-y divide-gray-200 rounded-md border border-gray-200 bg-white p-0 dark:bg-black sm:mx-0">
        {queryIntegrations.data &&
          queryIntegrations.data.items.map(
            ({ title, type, variant, slug, name, description, logo, installed, credentialIds }) => (
              <li key={title}>
                <ConferenceAppItem
                  type={type}
                  variant={variant}
                  slug={slug}
                  title={name}
                  description={description}
                  imageSrc={logo}
                  installed={installed}
                  credentialIds={credentialIds}
                />
              </li>
            )
          )}
      </List>

      {queryIntegrations.isLoading && !queryIntegrations.data && (
        <ul className="divide-y divide-gray-200 rounded-md border border-gray-200 bg-white p-0 dark:bg-black">
          {[0, 0, 0].map((_item, index) => {
            return (
              <li className="flex w-full flex-row justify-center border-b-0 py-6" key={index}>
                <SkeletonAvatar className="mx-6 h-8 w-8 px-4" />
                <SkeletonText className="ml-1 mr-4 mt-3 h-5 w-full" />
                <SkeletonButton className="mr-6 h-8 w-20 rounded-md p-5" />
              </li>
            );
          })}
        </ul>
      )}
      <button
        type="button"
        data-testid="save-calendar-button"
        className={classNames(
          "mt-8 flex w-full flex-row justify-center rounded-md border bg-blue-600 p-2 text-center text-sm text-white"
        )}
        onClick={() => nextStep()}>
        {`${t("next_step_text")}`}
        <ArrowRightIcon className="ml-2 h-4 w-4 self-center" aria-hidden="true" />
      </button>
    </>
  );
};

export { ConnectConferenceApps };
