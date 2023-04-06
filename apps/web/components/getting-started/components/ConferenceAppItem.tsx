import useAddAppMutation from "@calcom/app-store/_utils/useAddAppMutation";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import type { App } from "@calcom/types/App";
import { Button, showToast } from "@calcom/ui";

interface IConferenceAppItem {
  title: string;
  description?: string;
  imageSrc: string;
  type: App["type"];
  variant: App["variant"];
  slug: App["slug"];
  installed: App["installed"];
  credentialIds: number[];
}

const ConferenceAppItem = (props: IConferenceAppItem) => {
  const { title, imageSrc, type, variant, slug, installed, credentialIds } = props;
  const { t } = useLocale();
  const utils = trpc.useContext();

  const mutation = useAddAppMutation(null, {
    onSuccess: (data) => {
      utils.viewer.integrations.invalidate({ variant: "conferencing" });

      if (data?.setupPending) return;
      if (typeof installed !== "undefined") {
        showToast(t("app_successfully_installed"), "success");
      }
    },
    onError: (error) => {
      if (error instanceof Error) showToast(error.message || t("app_could_not_be_installed"), "error");
    },
  });

  const deleteAppMutation = trpc.viewer.deleteCredential.useMutation({
    onSuccess: () => {
      showToast(t("app_removed_successfully"), "success");
      utils.viewer.integrations.invalidate({ variant: "conferencing" });
    },
    onError: () => {
      showToast("Error deleting app", "error");
    },
  });

  return (
    <div className="flex flex-row items-center justify-between p-5">
      <div className="flex items-center space-x-3">
        <img src={imageSrc} alt={title} className="h-8 w-8" />
        <p className="text-sm font-bold">{title}</p>
      </div>
      {credentialIds.length > 0 ? (
        <Button
          color="secondary"
          className="min-w-24 justify-center"
          onClick={() => deleteAppMutation.mutate({ id: credentialIds[0] })}>
          {t("Uninstall")}
        </Button>

      ) : (
        <Button
          color="secondary"
          className="min-w-24 justify-center"
          onClick={() => mutation.mutate({ type: type, variant: variant, slug: slug, isOmniInstall: true })}>
          {t("install")}
        </Button>
      )}
    </div>
  );
};

export { ConferenceAppItem };
