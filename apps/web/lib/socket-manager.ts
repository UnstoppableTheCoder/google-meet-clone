let ws: WebSocket;

export const setWsConnection = (
  id: string,
  meetingId: string,
  token: string,
) => {
  ws = new WebSocket(
    `ws://localhost:8080?id=${id}&meetingId=${meetingId}&token=${token}`,
  );
  if (!ws) return;
  return ws;
};

export const getWSConnection = () => ws;

export const closeWsConnection = () => {
  ws.close();
};
