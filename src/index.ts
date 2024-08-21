import { app, io, server } from "./server";
import { client, status } from "./wa";
import {
  indexRouteHandler,
  getMessages,
  getContacs,
  getMessagesGroup,
} from "./routeHandlers";
import contactRouter from "./domain/contacts/contacts.routes";
import messageRouter from "./domain/messages/messages.routes";

io.on("connection", () => {
  io.emit("status", status);
});



app.use("/api/contacts", contactRouter);
app.use("/api/messages", messageRouter);
app.get("/", (req, res) => res.send("Hello World!"));
app.get("/api/status", indexRouteHandler);
app.get("/api/messages", getMessages);
app.get("/api/messages-group", getMessagesGroup);
app.get("/api/contacts", getContacs);

// listen on port 3000
server.listen(3000, () => {
  client.initialize();
  console.log("Server listening on port 3000");
});

// test
