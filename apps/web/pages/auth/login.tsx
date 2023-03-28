import { jwtVerify } from "jose";
import type { GetServerSidePropsContext } from "next";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { SAMLLogin } from "@calcom/features/auth/SAMLLogin";
import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { isSAMLLoginEnabled, samlProductID, samlTenantID } from "@calcom/features/ee/sso/lib/saml";
import { WEBSITE_URL } from "@calcom/lib/constants";
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
  totpEmail,
}: inferSSRProps<typeof _getServerSideProps> & WithNonceProps) {
  const { t } = useLocale();
  const methods = useForm<LoginValues>();
  const [isAutoLoginUnsuccesfull, setIsAutoLoginUnsuccesfull] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    signIn("saml", {}, { tenant: samlTenantID, product: samlProductID }).catch(() => {
      setIsAutoLoginUnsuccesfull(true);
    });
  }, []);

  if (!isAutoLoginUnsuccesfull) {
    return null;
  }

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
  const { req, res } = context;

  const session = await getServerSession({ req, res });
  const ssr = await ssrInit(context);

  const verifyJwt = (jwt: string) => {
    const secret = new TextEncoder().encode(process.env.CALENDSO_ENCRYPTION_KEY);

    return jwtVerify(jwt, secret, {
      issuer: WEBSITE_URL,
      audience: `${WEBSITE_URL}/auth/login`,
      algorithms: ["HS256"],
    });
  };

  let totpEmail = null;
  if (context.query.totp) {
    try {
      const decryptedJwt = await verifyJwt(context.query.totp as string);
      if (decryptedJwt.payload) {
        totpEmail = decryptedJwt.payload.email as string;
      } else {
        return {
          redirect: {
            destination: "/auth/error?error=JWT%20Invalid%20Payload",
            permanent: false,
          },
        };
      }
    } catch (e) {
      return {
        redirect: {
          destination: "/auth/error?error=Invalid%20JWT%3A%20Please%20try%20again",
          permanent: false,
        },
      };
    }
  }

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
      totpEmail,
    },
  };
};

export const getServerSideProps = withNonce(_getServerSideProps);
