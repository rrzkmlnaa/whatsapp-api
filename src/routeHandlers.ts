import { RequestHandler } from "express";
import { client } from "./wa";
import { formatTimestampToAsiaJakarta } from "./helper";

interface QueryParams {
  phoneNumber?: string;
  limit?: string; // Since query parameters are always strings, limit should be typed as string
}

export const indexRouteHandler: RequestHandler = (req, res) => {
  res.sendFile(__dirname + "/index.html");
};

export const sendRouteHandler: RequestHandler = async (req, res) => {
  const { to, text } = req.body;

  if (to && text) {
    await client.sendMessage(`${to}@s.whatsapp.net`, text);
    res.status(200).send("Message sent");
  } else {
    res.status(400).send("Invalid message");
  }
};

export const broadCastRouteHandler: RequestHandler = async (req, res) => {
  const { to, text } = req.body;

  if (to && text) {
    for (const contact of to) {
      await client.sendMessage(`${contact}@s.whatsapp.net`, text);
    }
    res.status(200).send("Message sent");
  } else {
    res.status(400).send("Invalid message");
  }
};

export const getMessages: RequestHandler = async (req, res) => {
  const { phoneNumber, limit } = req.query as QueryParams; // Explicitly type req.query

  if (!phoneNumber) {
    return res.status(400).send("Phone number is required");
  }

  try {
    // Get the chat by ID
    const chat = await client.getChatById(`${phoneNumber}@c.us`);

    // Fetch the messages from the chat
    const messages: any = await chat.fetchMessages({
      limit: limit ? parseInt(limit) : undefined,
    });

    // Process the messages as needed
    const formattedMessages = messages.map((msg: any) => ({
      information: {
        id: msg.id.id,
        fromMe: msg.fromMe,
        viewed: msg._data.viewed, // Use appropriate property for "viewed"
        from: msg.from,
        to: msg.to,
        timestamp: formatTimestampToAsiaJakarta(msg.timestamp),
        type: msg.type,
      },
      message: msg.body, // Use msg.body for the actual message text
    }));

    // Send the messages as the response
    res.json(formattedMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).send("Failed to fetch messages");
  }
};

export const getContacs: RequestHandler = async (req, res) => {
  try {
    const contacts = await client.getContacts();

    // Process the contacts as needed
    const formattedContacts = contacts.map((contact) => ({
      id: contact.id._serialized,
      name: contact.name,
      number: contact.number,
      isMyContact: contact.isMyContact,
      isBusiness: contact.isBusiness,
      isMe: contact.isMe,
      isGroup: contact.isGroup,
      isWAContact: contact.isWAContact,
    }));

    res.send(formattedContacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).send("Failed to fetch contacts");
  }
};
