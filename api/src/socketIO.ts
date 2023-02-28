import { Server as SocketServer, Socket } from "socket.io";
import { server } from "./server";

//  SOCKET IO ===========
const io = new SocketServer(server, {
  cors: {
    origin: "*",
  },
  serveClient: false,
  path: "/socket-io",
});

io.on("connection", async (socket: Socket) => {
  console.log(`socket ${socket.id} is connected!`);
});

class SocketIO {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }
}
