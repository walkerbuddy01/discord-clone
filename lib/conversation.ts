import { db } from "@/lib/db";

const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId));

  if (!conversation) {
    conversation = await createConversation(memberOneId, memberTwoId);
  }
  return conversation;
};

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    const conversation = await db.conversation.findFirst({
      where: {
        AND: [{ MemberOneId: memberOneId }, { MemberTwoId: memberTwoId }],
      },
      include: {
        MemberOne: {
          include: {
            profile: true,
          },
        },
        MemberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    return conversation;
  } catch (error: any) {
    return null;
    console.log(error.message);
  }
};

const createConversation = async (MemberOneId: string, MemberTwoId: string) => {
  try {
    const newConversation = await db.conversation.create({
      data: {
        MemberOneId,
        MemberTwoId,
      },
      include: {
        MemberOne: {
          include: {
            profile: true,
          },
        },
        MemberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    return newConversation;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { findConversation, createConversation, getOrCreateConversation };
