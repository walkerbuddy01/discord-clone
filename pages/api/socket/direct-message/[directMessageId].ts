import currentUserPage from "@/lib/currentUserPage";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { MemberRoles } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "METHOD NOT ALLOWED" });
  }

  try {
    const profile = await currentUserPage(req);
    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({
        error: "UNAUTHORIZED ACCESS",
      });
    }

    if (!conversationId) {
      return res.status(400).json({
        error: "CONVERSATION ID NOT FOUND",
      });
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

    const member =
      conversation?.MemberOne.profileId === profile.id
        ? conversation.MemberOne
        : conversation?.MemberTwo;

    if (!member) {
      return res.status(404).json({
        error: "MEMBER NOT FOUND ",
      });
    }

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({
        error: "MESSAGE NOT FOUND ",
      });
    }

    const messageOwner = directMessage.memberId === member.id;
    const isAdmin = member.role === MemberRoles.ADMIN;
    const isModerator = member.role === MemberRoles.MODERATOR;
    const canModify = messageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({
        error: "UNAUTHORIZED FOR THIS ACTION",
      });
    }

    if (req.method === "DELETE") {
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
          conversationId: conversation?.id,
        },
        data: {
          fileUrl: null,
          Content: "this message has been deleted",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }
    if (req.method === "PATCH") {
      if (!messageOwner) {
        return res.status(401).json({ error: "UNAUTHORIZED FOR THIS ACTION" });
      }
      directMessage = await db.directMessage.update({
        where: {
          id: directMessage.id as string,
          conversationId: conversation?.id,
        },
        data: {
          fileUrl: null,
          Content: content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${conversationId}:message:update`;

    res?.socket?.server?.io.emit(updateKey, directMessage);

    return res.status(200).json(directMessage);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "INTERNAL SERVER ERROR",
    });
  }
}
