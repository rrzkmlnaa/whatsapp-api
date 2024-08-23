import { Request, Response } from "express";
import { db } from "../../config/database/database";
import { count, sql } from "drizzle-orm";
import { contacts } from "../contacts/contacts.schema";
import { messages } from "../messages/messages.schema";
import { labels } from "../labels/labels.schema";
import { groups } from "../groups/group.schema";

export class DashboardController {
  static async index(_req: Request, res: Response) {
    try {
      // count contacts
      const totalContactResult = await db
        .select({ count: count() })
        .from(contacts);
      const totalContact = totalContactResult[0]?.count || 0;

      // count messages
      const totalMessageResult = await db
        .select({ count: count() })
        .from(messages)
        .where(sql`JSON_LENGTH(${messages.message}) != 0`);
      const totalMessage = totalMessageResult[0]?.count || 0;

      // count labels
      const totalLabelResult = await db.select({ count: count() }).from(labels);
      const totalLabel = totalLabelResult[0]?.count || 0;

      // count groups
      const totalGroupResult = await db.select({ count: count() }).from(groups);
      const totalGroup = totalGroupResult[0]?.count || 0;

      // get

      return res
        .status(200)
        .json({ totalContact, totalMessage, totalLabel, totalGroup });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
