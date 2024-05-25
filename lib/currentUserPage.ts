import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";

export default async function currentUserPage(req: NextApiRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return null;
  }

  try {
    const userProfile = await db.profile.findUnique({
      where: {
        userId,
      },
    });

    if (!userProfile) {
      return null;
    }
    return userProfile;
  } catch (error) {
    console.log("Error in current User");
  }
}
