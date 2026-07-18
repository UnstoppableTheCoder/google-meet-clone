let ws: WebSocket;

export const setWsConnection = (
  userId: string,
  meetingId: string,
  token: string,
) => {
  ws = new WebSocket(
    `${process.env.NEXT_PUBLIC_WS_BASE_URL}?userId=${userId}&meetingId=${meetingId}&token=${token}`,
  );

  if (!ws) return;
  return ws;
};

export const getWSConnection = () => ws;

export const closeWsConnection = () => {
  ws.close();
};
