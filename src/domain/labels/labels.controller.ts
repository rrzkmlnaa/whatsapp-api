import { Request, Response } from "express";
import { client } from "../../wa";
import { db } from "../../config/database/database";
import { labels } from "./labels.schema";

export class LabelsController {
  static async getLabels(_req: Request, res: Response) {
    try {
      const contactData = await db.query.Labels.findMany();

      if (contactData.length === 0) {
        res.status(404).json({ message: "No Labels found" });
      }

      return res.status(200).json(contactData);
    } catch (error) {
      console.error("Error fetching Labels:", error);
      res.status(500).send("Failed to fetch Labels");
    }
  }
  static async initLabels(_req: Request, res: Response) {
    try {
      const contactData = await client.getLabels();

      if (contactData.length === 0) {
        return { message: "No Labels found" };
      }

      let formattedLabels = contactData.map((contact) => ({
        server: contact.id.server,
        name: contact.name,
        number: contact.number,
      }));
      formattedLabels = formattedLabels.filter(
        (contact) => contact.server === "c.us"
      );
      if (formattedLabels.length === 0) {
        res.status(404).json({ message: "No Labels found" });
      }

      await db.insert(Labels).values(formattedLabels);

      res.status(200).json({
        message: "Labels inserted into database",
      });
    } catch (error) {
      console.error("Error fetching Labels:", error);
      return [];
    }
  }
}
