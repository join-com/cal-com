import type { GetServerSidePropsContext } from "next";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { SAMLLogin } from "@calcom/features/auth/SAMLLogin";
import { isSAMLLoginEnabled, samlProductID, samlTenantID } from "@calcom/features/ee/sso/lib/saml";
import { getSession } from "@calcom/lib/auth";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import prisma from "@calcom/prisma";
import { Alert } from "@calcom/ui";

import type { inferSSRProps } from "@lib/types/inferSSRProps";
import type { WithNonceProps } from "@lib/withNonce";
import withNonce from "@lib/withNonce";

import AddToHomescreen from "@components/AddToHomescreen";
import AuthContainer from "@components/ui/AuthContainer";

import { IS_GOOGLE_LOGIN_ENABLED } from "@server/lib/constants";
import { ssrInit } from "@server/lib/ssr";

interface LoginValues {
  email: string;
  password: string;
  totpCode: string;
  csrfToken: string;
}

export default function Login({
  isSAMLLoginEnabled,
  samlTenantID,
  samlProductID,
}: inferSSRProps<typeof _getServerSideProps> & WithNonceProps) {
  const { t } = useLocale();
  const methods = useForm<LoginValues>();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <>
      <AuthContainer title={t("login")} description={t("login")} showLogo>
        {errorMessage && <Alert severity="error" title={errorMessage} className="mb-3" />}
        <FormProvider {...methods}>
          <div className="space-y-3">
            {isSAMLLoginEnabled && (
              <SAMLLogin
                samlTenantID={samlTenantID}
                samlProductID={samlProductID}
                setErrorMessage={setErrorMessage}
              />
            )}
          </div>
        </FormProvider>
      </AuthContainer>
      <AddToHomescreen />
    </>
  );
}

// TODO: Once we understand how to retrieve prop types automatically from getServerSideProps, remove this temporary variable
const _getServerSideProps = async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getSession({ req });
  const ssr = await ssrInit(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const userCount = await prisma.user.count();
  if (userCount === 0) {
    // Proceed to new onboarding to create first admin user
    return {
      redirect: {
        destination: "/auth/setup",
        permanent: false,
      },
    };
  }
  return {
    props: {
      trpcState: ssr.dehydrate(),
      isGoogleLoginEnabled: IS_GOOGLE_LOGIN_ENABLED,
      isSAMLLoginEnabled,
      samlTenantID,
      samlProductID,
    },
  };
};

export const getServerSideProps = withNonce(_getServerSideProps);
