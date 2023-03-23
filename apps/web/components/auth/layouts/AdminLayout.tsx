import { UserPermissionRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { ComponentProps } from "react";
import React, { useEffect } from "react";

import SettingsLayout from "@calcom/features/settings/layouts/SettingsLayout";
import type Shell from "@calcom/features/shell/Shell";
import { ErrorBoundary } from "@calcom/ui";

export default function AdminLayout({
  children,

  ...rest
}: { children: React.ReactNode } & ComponentProps<typeof Shell>) {
  const session = useSession();
  const role = session.data?.user.role;
  const isAdmin = role === UserPermissionRole.ADMIN || role === "INACTIVE_ADMIN";
  const router = useRouter();

  // Force redirect on component level
  useEffect(() => {
    if (role && !isAdmin) {
      router.replace("/event-types");
    }
  }, [isAdmin, role, router]);

  const isAppsPage = router.asPath.startsWith("/settings/admin/apps");

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (session.status === "loading" || !isAdmin) {
    return null;
  }

  return (
    <SettingsLayout {...rest}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </SettingsLayout>
  );
}

export const getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;
