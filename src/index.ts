import { app, io, server } from "./server";
import { client, status } from "./wa";
import { indexRouteHandler, getMessages, getContacs } from "./routeHandlers";
import contactsRouter from "./domain/contacts/contacts.routes"
import messagesRouter from "./domain/messages/messages.routes"

io.on("connection", () => {
  io.emit("status", status);
});

app.use('/api/contacts', contactsRouter);
app.use('/api/messages', messagesRouter);

app.get("/", (req, res) => res.send("Hello World!"));
app.get("/api/status", indexRouteHandler);
// app.get("/api/messages", getMessages);


// listen on port 3000
server.listen(3001, () => {
  client.initialize();
  console.log("Server listening on port 3001");
});

// test
