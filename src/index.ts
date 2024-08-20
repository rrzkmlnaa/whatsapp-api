import { app, io, server } from "./server";
import { client, status } from "./wa";
import { indexRouteHandler, getMessages, getContacs } from "./routeHandlers";

io.on("connection", () => {
  io.emit("status", status);
});

app.get("/", (req, res) => res.send("Hello World!"));
app.get("/api/status", indexRouteHandler);
app.get("/api/messages", getMessages);
app.get("/api/contacs", getContacs);

// listen on port 3000
server.listen(3000, () => {
  client.initialize();
  console.log("Server listening on port 3000");
});
