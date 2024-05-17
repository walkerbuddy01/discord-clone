import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
async function intialSetup() {
  try {
    const user = await currentUser();
    if (!user) {
      return auth().redirectToSignIn();
    }

    const profile = await db.profile.findUnique({
      where: {
        userId: user.id,
      },
    });
    if (profile) {
      return profile;
    }

    const newProfile = await db.profile.create({
      data: {
        userId: user.id,
        name: `${user.firstName} ${user.lastActiveAt}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newProfile;
  } catch (error: any) {
    // console.log(error.message);
  }
}

export default intialSetup;
