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
    const { messageId, serverId, channelId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({
        error: "UNAUTHORIZED ACCESS",
      });
    }
    if (!serverId) {
      return res.status(400).json({
        error: "MISSING SERVER ID ",
      });
    }
    if (!channelId) {
      return res.status(400).json({
        error: "MISSING CHANNEL ID ",
      });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({
        error: "SERVER NOT FOUND ",
      });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: server.id,
      },
    });

    if (!channel) {
      return res.status(404).json({
        error: "CHANNEL NOT FOUND ",
      });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) {
      return res.status(404).json({
        error: "MEMBER NOT FOUND ",
      });
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.delete) {
      return res.status(404).json({
        error: "MESSAGE NOT FOUND ",
      });
    }

    const messageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRoles.ADMIN;
    const isModerator = member.role === MemberRoles.MODERATOR;
    const canModify = messageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({
        error: "UNAUTHORIZED FOR THIS ACTION",
      });
    }

    if (req.method === "DELETE") {
      message = await db.message.update({
        where: {
          id: messageId as string,
          channelId: channel.id,
        },
        data: {
          fileUrl: null,
          Content: "this message has been deleted",
          delete: true,
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
      message = await db.message.update({
        where: {
          id: messageId as string,
          channelId: channel.id,
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

    const updateKey = `chat:${channelId}:message:update`;

    res?.socket?.server?.io.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "INTERNAL SERVER ERROR",
    });
  }
}
