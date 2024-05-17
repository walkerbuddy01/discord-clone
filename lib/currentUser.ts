import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export default async function currentUser() {
  const { userId } = auth();
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
