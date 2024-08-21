import * as contacts from "../../domain/contacts/contacts.schema";
import * as messages from "../../domain/messages/messages.schema";

export const schema = {
  ...contacts,
    ...messages,
};
