import { Request, Response } from "express";
import { client } from "../../wa";
import { db } from "../../config/database/database";
import { messages } from "./messages.schema";
import { formatTimestampToAsiaJakarta } from "../../helper";

export class MessagesController {
    static async getMessages(req:Request, res:Response) {
      const message = await db.query.contacts.findMany({
        with: {
            messages: true
        }
      })

        if (message.length === 0) {
            return res.status(404).json({ message: "No messages found" });
        }

        return res.status(200).json(message);
    }

    static async initMessages(_req: Request, res: Response) {
        try {
          // Ambil semua kontak dari database
          const phoneNumbers = await db.query.contacts.findMany();
          const allFormattedMessages: any[] = []; // Array untuk menyimpan semua pesan yang diformat

          // Loop melalui setiap kontak
          for (const contact of phoneNumbers) {
            const phoneNumber = contact.number;

            try {
              // Dapatkan chat dari WhatsApp berdasarkan nomor telepon
              const chat = await client.getChatById(`${phoneNumber}@c.us`);

              // Ambil semua pesan dari chat
              const message = await chat.fetchMessages({
                limit: 100000000,
              });

              // Format pesan
              const formattedMessages = message.map((msg: any) => ({
                information: {
                  id: msg.id.id,
                  fromMe: msg.fromMe,
                  viewed: msg._data.viewed,
                  from: msg.from,
                  to: msg.to,
                  timestamp: formatTimestampToAsiaJakarta(msg.timestamp),
                  type: msg.type,
                },
                message: msg.body,
              }));

              // Simpan pesan yang diformat ke dalam array utama
              allFormattedMessages.push(...formattedMessages);

              // Simpan ke dalam database (kode ini masih dikomentari, bisa diaktifkan jika diperlukan)
              await db.insert(messages).values({
                contactId: contact.id,
                message: formattedMessages, // Pastikan ini dalam format JSON yang sesuai
              });

            } catch (err) {
              console.error(`Gagal mendapatkan chat untuk nomor ${phoneNumber}:`, err);
              return res.status(500).json({
                message: `Failed to get chat for number ${phoneNumber}`,
              });
            }
          }

          // Kirim respons sukses dengan semua pesan yang diformat
          res.status(200).json({
            message: "Messages inserted into database",
          });
        } catch (error) {
          console.error("Error during message insertion:", error);
          res.status(500).json({
            message: "Failed to insert messages",
          });
        }
      }
}
