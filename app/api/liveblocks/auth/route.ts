import { auth, currentUser } from "@clerk/nextjs/server";

import { liveblocks } from "@/lib/liveblocks";

export async function POST() {
  const { isAuthenticated, userId, orgId } = await auth();

  if (!isAuthenticated) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await currentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { body, status } = await liveblocks.identifyUser(
    {
      userId,
      groupIds: orgId ? [orgId] : [],
      organizationId: orgId,
    },
    {
      userInfo: {
        name:
          [user.firstName, user.lastName].filter(Boolean).join(" ") ||
          user.username ||
          user.primaryEmailAddress?.emailAddress ||
          userId,
        avatar: user.imageUrl,
      },
    },
  );

  return new Response(body, { status });
}
