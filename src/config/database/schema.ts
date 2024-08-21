import * as contacts from "../../domain/contacts/contacts.schema";
import * as messages from "../../domain/messages/messages.schema";
import * as labels from "../../domain/labels/labels.schema";

export const schema = {
  ...contacts,
  ...messages,
  ...labels,
};
