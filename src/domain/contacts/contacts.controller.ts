import { Request, Response } from "express";
import { client } from "../../wa";
import { db } from "../../config/database/database";
import { contacts } from "./contacts.schema";

export class ContactsController {
  static async getContacts(_req: Request, res: Response) {
    try {
      const contactData = await db.query.contacts.findMany();

      console.log(contactData)

      if (contactData.length === 0) {
       res.status(404).json({ message: "No contacts found" });
      }

      return res.status(200).json(contactData);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).send("Failed to fetch contacts");
    }
  }

  static async initContacts(_req: Request, res: Response) {
    try {
      const contactData = await client.getContacts();
      console.log("Contacts fetched:", contactData);

      if (contactData.length === 0) {
        return { message: "No contacts found" };
      }

      let formattedContacts = contactData.map((contact) => ({
        server: contact.id.server,
        name: contact.name,
        number: contact.number,
      }));
      formattedContacts = formattedContacts.filter(
        (contact) => contact.server === "c.us"
      );
      if (formattedContacts.length === 0) {
       res.status(404).json({ message: "No contacts found" });
      }

      await db.insert(contacts).values(formattedContacts);

      res.status(200).json({
        message: "Contacts inserted into database",
      });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return [];
    }
  }
}
