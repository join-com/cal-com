import { ArrowRightIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import type { MutableRefObject } from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Schedule } from "@calcom/features/schedules";
import { DEFAULT_SCHEDULE } from "@calcom/lib/availability";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import type { TRPCClientErrorLike } from "@calcom/trpc/react";
import { trpc } from "@calcom/trpc/react";
import type { AppRouter } from "@calcom/trpc/server/routers/_app";
import { Button, Form, showToast } from "@calcom/ui";

interface ISetupAvailabilityProps {
  defaultScheduleId?: number | null;
  // eslint-disable-next-line @typescript-eslint/ban-types
  callbackRef: MutableRefObject<null | Function>;
}

const SetupAvailability = (props: ISetupAvailabilityProps) => {
  const [isFinishClicked, setIsFinishClicked] = useState(false);
  const { defaultScheduleId, callbackRef } = props;

  const { t } = useLocale();

  const utils = trpc.useContext();

  const router = useRouter();
  const { data: eventTypes } = trpc.viewer.eventTypes.list.useQuery();

  let queryAvailability;
  if (defaultScheduleId) {
    queryAvailability = trpc.viewer.availability.schedule.get.useQuery(
      { scheduleId: defaultScheduleId },
      {
        enabled: router.isReady,
      }
    );
  }

  const availabilityForm = useForm({
    defaultValues: {
      schedule: queryAvailability?.data?.availability || DEFAULT_SCHEDULE,
    },
  });

  const DEFAULT_EVENT_TYPES = [
    {
      title: t("screening_call"),
      slug: "30",
      length: 30,
    },
    {
      title: t("cultural_fit_interview"),
      slug: "60",
      length: 60,
    },
    {
      title: t("technical_call"),
      slug: "tech",
      length: 120,
    },
    {
      title: t("case_study_all"),
      slug: "120",
      length: 120,
    },
    {
      title: t("hiring_manager_interview"),
      slug: "hiring-manager",
      length: 60,
    },
    {
      title: t("founder_interview"),
      slug: "45",
      length: 45,
    },
  ];

  const mutationOptions = {
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      throw new Error(error.message);
    },
  };
  const createSchedule = trpc.viewer.availability.schedule.create.useMutation(mutationOptions);
  const updateSchedule = trpc.viewer.availability.schedule.update.useMutation(mutationOptions);
  const createEventType = trpc.viewer.eventTypes.create.useMutation();

  const profileMutation = trpc.viewer.updateProfile.useMutation({
    onSuccess: async () => {
      await utils.viewer.me.refetch();

      router.push("/");
    },
    onError: () => {
      showToast(t("problem_saving_user_profile"), "error");
    },
  });

  const handleSubmit = async (values?: Record<string, unknown>) => {
    setIsFinishClicked(true);

    try {
      if (eventTypes?.length === 0) {
        await Promise.all(
          DEFAULT_EVENT_TYPES.map(async (event) => {
            return createEventType.mutate(event);
          })
        );
      }

      if (values) {
        if (defaultScheduleId) {
          await updateSchedule.mutate({
            scheduleId: defaultScheduleId,
            name: t("default_schedule_name"),
            ...values,
          });
        } else {
          await createSchedule.mutate({
            name: t("default_schedule_name"),
            ...values,
          });
        }
      }

      profileMutation.mutate({ completedOnboarding: true });
    } catch (error) {
      setIsFinishClicked(false);
      if (error instanceof Error) {
        // setError(error);
        // @TODO: log error
      }
    }
  };

  useEffect(() => {
    callbackRef.current = handleSubmit;
    return () => {
      callbackRef.current = null;
    };
  }, [handleSubmit]);

  return (
    <Form
      className="w-full bg-white text-black dark:bg-opacity-5 dark:text-white"
      form={availabilityForm}
      handleSubmit={handleSubmit}>
      <Schedule control={availabilityForm.control} name="schedule" weekStart={1} />

      <div>
        <Button
          type="submit"
          data-testid="save-availability"
          className="mt-8 flex w-full flex-row justify-center rounded-md border bg-blue-600 p-2 text-center text-sm text-white"
          disabled={availabilityForm.formState.isSubmitting || isFinishClicked}>
          {t("finish")}
          <ArrowRightIcon className="ml-2 h-4 w-4 self-center" aria-hidden="true" />
        </Button>
      </div>
    </Form>
  );
};

export { SetupAvailability };
