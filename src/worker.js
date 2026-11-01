// Static pages come from ./public (Workers static assets). This Worker only
// runs for paths with no matching file, i.e. the phone-remote relay under /api.
//
// Relay: the teleprompter page opens a WebSocket to /api/room/<CODE>/ws.
// The phone page POSTs /api/room/<CODE>/cmd/<command>. One Durable Object per
// room code forwards each command to the sockets in that room.
import { DurableObject } from 'cloudflare:workers';

const COMMANDS = new Set(['play', 'back', 'ahead', 'rec', 'pause']);
const ROUTE = /^\/api\/room\/([A-Z2-9]{6})\/(?:(ws)|cmd\/([a-z]+))$/;

export default {
  async fetch(request, env) {
    const m = new URL(request.url).pathname.match(ROUTE);
    if (!m) return new Response('Not found', { status: 404 });
    const [, code, ws, cmd] = m;
    if (ws && request.headers.get('Upgrade') !== 'websocket') {
      return new Response('Expected WebSocket', { status: 426 });
    }
    if (!ws && (request.method !== 'POST' || !COMMANDS.has(cmd))) {
      return new Response('Bad command', { status: 400 });
    }
    return env.ROOM.get(env.ROOM.idFromName(code)).fetch(request);
  },
};

export class Room extends DurableObject {
  async fetch(request) {
    if (request.headers.get('Upgrade') === 'websocket') {
      const { 0: client, 1: server } = new WebSocketPair();
      this.ctx.acceptWebSocket(server); // hibernation API: no cost while idle
      return new Response(null, { status: 101, webSocket: client });
    }
    const cmd = new URL(request.url).pathname.split('/').pop();
    const sockets = this.ctx.getWebSockets();
    for (const ws of sockets) ws.send(cmd);
    // 404 tells the phone no teleprompter is listening on this code
    return new Response(null, { status: sockets.length ? 204 : 404 });
  }

  webSocketMessage() {} // the teleprompter never sends; ignore

  webSocketClose(ws, code) {
    ws.close(code);
  }
}
