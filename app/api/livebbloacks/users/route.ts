import { auth, clerkClient } from "@clerk/nextjs/server";

const MAX_USER_IDS = 100;

type RequestBody = {
  userids?: unknown;
};

export async function POST(request: Request) {
  const { isAuthenticated, userId, orgId } = await auth();

  if (!isAuthenticated || !userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!orgId) {
    return new Response("Organization required", { status: 403 });
  }

  let body: RequestBody;

  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    !Array.isArray(body.userids) ||
    body.userids.some((id) => typeof id !== "string" || id.length === 0)
  ) {
    return Response.json(
      { error: "userids must be an array of non-empty strings" },
      { status: 400 },
    );
  }

  if (body.userids.length > MAX_USER_IDS) {
    return Response.json(
      { error: `userids cannot contain more than ${MAX_USER_IDS} entries` },
      { status: 400 },
    );
  }

  if (body.userids.length === 0) {
    return Response.json([]);
  }

  const userIds = body.userids as string[];
  const client = await clerkClient();
  const { data: memberships } =
    await client.organizations.getOrganizationMembershipList({
      organizationId: orgId,
      userId: [...new Set(userIds)],
      limit: MAX_USER_IDS,
    });

  const usersById = new Map(
    memberships.flatMap((membership) => {
      const user = membership.publicUserData;

      if (!user) {
        return [];
      }

      const name =
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        user.identifier ||
        user.userId;

      return [[user.userId, { name, avatar: user.imageUrl }] as const];
    }),
  );

  return Response.json(userIds.map((id) => usersById.get(id) ?? null));
}
