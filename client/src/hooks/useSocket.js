import { socket } from "../socket";

export function useSocket(projectId) {
  socket.emit("join-project", projectId);
  return socket;
}
