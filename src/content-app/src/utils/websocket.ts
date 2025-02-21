import { io, Socket } from "socket.io-client";
import { IN_SESSION_SOCKET_URL } from "@/constants";

interface WebsocketClientProps {
  url: string;
  query?: Record<string, any>;
}

export default class WebsocketClient {
  private static instances: Record<string, WebsocketClient> = {};
  private socket: Socket;
  private namespace: string;

  private constructor(props: WebsocketClientProps) {
    this.namespace = props.url;
    this.socket = io(`${IN_SESSION_SOCKET_URL}/${props.url}`, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
      query: props.query || {},
    });

    // Handle connection errors
    this.socket.on("connect_error", error => {
      console.error(`Connection error for namespace ${props.url}:`, error);
    });

    this.socket.on("disconnect", reason => {
      console.warn(`Disconnected from namespace ${props.url}:`, reason);
    });
  }

  public static getInstance(props: WebsocketClientProps): WebsocketClient {
    const key = `${props.url}-${JSON.stringify(props.query)}`;
    if (!WebsocketClient.instances[key]) {
      WebsocketClient.instances[key] = new WebsocketClient(props);
    }

    return WebsocketClient.instances[key];
  }

  public getSocket(): Socket {
    return this.socket;
  }

  public disconnect(): void {
    const key = `${this.namespace}-${JSON.stringify(this.socket.io.opts.query)}`;
    if (this.socket.connected) {
      this.socket.disconnect();
    }
    delete WebsocketClient.instances[key];
    console.log(`Socket instance for ${key} has been disconnected and removed.`);
  }
}
