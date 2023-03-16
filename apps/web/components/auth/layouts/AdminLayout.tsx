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
  const router = useRouter();

  // Force redirect on component level
  useEffect(() => {
    if (session.data && session.data.user.role !== UserPermissionRole.ADMIN) {
      router.replace("/event-types");
    }
  }, [session, router]);

  const isAppsPage = router.asPath.startsWith("/settings/admin/apps");

  if (session.status === "loading" || session.data?.user.role !== UserPermissionRole.ADMIN) {
    return null;
  }

  return (
    <SettingsLayout {...rest}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </SettingsLayout>
  );
}

export const getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;
