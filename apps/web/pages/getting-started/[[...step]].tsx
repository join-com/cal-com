import type { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRef } from "react";
import { z } from "zod";

import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { APP_NAME } from "@calcom/lib/constants";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import prisma from "@calcom/prisma";
import { Button, StepCard, Steps } from "@calcom/ui";

import type { inferSSRProps } from "@lib/types/inferSSRProps";

import { ConnectedCalendars } from "@components/getting-started/steps-views/ConnectCalendars";
import { SetupAvailability } from "@components/getting-started/steps-views/SetupAvailability";

export type IOnboardingPageProps = inferSSRProps<typeof getServerSideProps>;

const INITIAL_STEP = "connected-calendar";
const steps = ["connected-calendar", "setup-availability"] as const;

const stepTransform = (step: (typeof steps)[number]) => {
  const stepIndex = steps.indexOf(step);
  if (stepIndex > -1) {
    return steps[stepIndex];
  }
  return INITIAL_STEP;
};

const stepRouteSchema = z.object({
  step: z.array(z.enum(steps)).default([INITIAL_STEP]),
});

const OnboardingPage = (props: IOnboardingPageProps) => {
  const router = useRouter();

  const { user } = props;
  const { t } = useLocale();

  // eslint-disable-next-line @typescript-eslint/ban-types
  const callbackRef = useRef<null | Function>(null);
  const result = stepRouteSchema.safeParse(router.query);
  const currentStep = result.success ? result.data.step[0] : INITIAL_STEP;

  const headers = [
    {
      title: `${t("connect_your_calendar")}`,
      subtitle: [`${t("connect_your_calendar_instructions")}`],
      skipText: `${t("connect_calendar_later")}`,
    },
    {
      title: `${t("set_availability")}`,
      subtitle: [
        `${t("set_availability_getting_started_subtitle_1")}`,
        `${t("set_availability_getting_started_subtitle_2")}`,
      ],
      skipText: `${t("setLater")}`,
    },
  ];

  const goToIndex = (index: number) => {
    const newStep = steps[index];
    router.push(
      {
        pathname: `/getting-started/${stepTransform(newStep)}`,
      },
      undefined
    );
  };

  const currentStepIndex = steps.indexOf(currentStep);

  return (
    <div
      className="dark:bg-brand dark:text-brand-contrast min-h-screen text-black"
      data-testid="onboarding"
      key={router.asPath}>
      <Head>
        <title>
          {APP_NAME} - {t("getting_started")}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mx-auto px-4 py-6 md:py-24">
        <div className="relative">
          <div className="sm:mx-auto sm:w-full sm:max-w-[600px]">
            <div className="mx-auto sm:max-w-[520px]">
              <header>
                <p className="font-cal mb-3 text-[28px] font-medium leading-7">
                  {headers[currentStepIndex]?.title || "Undefined title"}
                </p>

                {headers[currentStepIndex]?.subtitle.map((subtitle, index) => (
                  <p className="font-sans text-sm font-normal text-gray-500" key={index}>
                    {subtitle}
                  </p>
                ))}
              </header>
              <Steps maxSteps={steps.length} currentStep={currentStepIndex + 1} navigateToStep={goToIndex} />
            </div>
            <StepCard>
              {currentStep === "connected-calendar" && <ConnectedCalendars nextStep={() => goToIndex(1)} />}

              {currentStep === "setup-availability" && (
                <SetupAvailability defaultScheduleId={user.defaultScheduleId} callbackRef={callbackRef} />
              )}
            </StepCard>
            {headers[currentStepIndex]?.skipText && (
              <div className="flex w-full flex-row justify-center">
                <Button
                  color="minimal"
                  data-testid="skip-step"
                  onClick={async (event) => {
                    event.preventDefault();

                    if (callbackRef.current) {
                      await callbackRef.current();
                    }

                    if (currentStepIndex + 1 < steps.length) {
                      goToIndex(currentStepIndex + 1);
                    }
                  }}
                  className="mt-8 cursor-pointer px-4 py-2 font-sans text-sm font-medium">
                  {headers[currentStepIndex]?.skipText}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { req, res } = context;

  const crypto = await import("crypto");
  const session = await getServerSession({ req, res });

  if (!session?.user?.id) {
    return { redirect: { permanent: false, destination: "/auth/login" } };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      bio: true,
      avatar: true,
      timeZone: true,
      weekStart: true,
      hideBranding: true,
      theme: true,
      brandColor: true,
      darkBrandColor: true,
      metadata: true,
      timeFormat: true,
      allowDynamicBooking: true,
      defaultScheduleId: true,
      completedOnboarding: true,
    },
  });

  if (!user) {
    throw new Error("User from session not found");
  }

  if (user.completedOnboarding) {
    return { redirect: { permanent: false, destination: "/event-types" } };
  }

  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? "", ["common"])),
      user: {
        ...user,
        emailMd5: crypto.createHash("md5").update(user.email).digest("hex"),
      },
    },
  };
};

export default OnboardingPage;
