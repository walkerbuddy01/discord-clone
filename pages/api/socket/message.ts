import currentUserPage from "@/lib/currentUserPage";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
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
    const { serverId, channelId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "unauthorized access" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "ServerID is missing " });
    }

    if (!channelId) {
      return res.status(400).json({ error: "ChannelID is missing " });
    }
    if (!content) {
      return res.status(400).json({ error: "content is missing " });
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
      return res.status(404).json({ error: "Server not found" });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) {
      return res.status(404).json({ error: "Member not found in server" });
    }

    const message = await db.message.create({
      data: {
        Content: content,
        fileUrl,
        channelId: channelId as string,
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

    const chatKey = `chat:${channelId}:messages`;
    res?.socket?.server?.io.emit(chatKey, message);

    return res.status(200).json(message);
  } catch (error: any) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "INTERNAL SERVER ERROR", message: error });
  }
}
