import currentUserPage from "@/lib/currentUserPage";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { Member } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `${req.method} Method not allowed ` });
  }

  try {
    const profile = await currentUserPage(req);
    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "unauthorized access" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "ConversationId is missing " });
    }

    if (!content) {
      return res.status(400).json({ error: "content is missing " });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            MemberOne: {
              profileId: profile.id,
            },
          },
          {
            MemberTwo: {
              profileId: profile.id,
            },
          },
        ],
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

    if (!conversation) {
      return res.status(404).json({ error: "conversation not found " });
    }

    const member =
      conversation.MemberOne.profileId === profile.id
        ? conversation.MemberOne
        : conversation.MemberTwo;

    if (!member) {
      return res
        .status(404)
        .json({ error: "Member not found in converssation" });
    }

    const message = await db.directMessage.create({
      data: {
        Content: content,
        fileUrl,
        conversationId: conversationId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const chatKey = `chat:${conversationId}:messages`;
    res?.socket?.server?.io.emit(chatKey, message);

    return res.status(200).json(message);
  } catch (error: any) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "INTERNAL SERVER ERROR", message: error });
  }
}
