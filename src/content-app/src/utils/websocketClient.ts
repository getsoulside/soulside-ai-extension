interface WebsocketClientProps {
  url: string;
  query?: Record<string, any>;
}

type EventCallback = (data: any) => void;

export default class WebsocketClient {
  private static instances: Record<string, WebsocketClient> = {};
  private namespace: string;
  private query: Record<string, any>;
  private eventHandlers: Map<string, EventCallback[]>;

  private constructor(props: WebsocketClientProps) {
    this.namespace = props.url;
    this.query = props.query || {};
    this.eventHandlers = new Map();

    if (chrome?.runtime?.id) {
      // Setup message listener for background script responses
      chrome.runtime.onMessage.addListener(message => {
        if (message.type === "SOULSIDE_WEBSOCKET_EVENT" && message.namespace === this.namespace) {
          this.handleEvent(message.event, message.data);
        }
      });
    } else {
      // Setup window message listener
      window.addEventListener("message", event => {
        if (
          event.data.type === "SOULSIDE_WEBSOCKET_EVENT" &&
          event.data.namespace === this.namespace
        ) {
          this.handleEvent(event.data.event, event.data.data);
        }
      });
    }

    this.connect();
  }

  private async connect(): Promise<void> {
    if (chrome?.runtime?.id) {
      chrome.runtime.sendMessage({
        action: "websocket",
        value: {
          socketAction: "connect",
          namespace: this.namespace,
          query: this.query,
        },
      });
    } else {
      window.postMessage(
        {
          type: "SOULSIDE_WEBSOCKET_CONNECT",
          namespace: this.namespace,
          query: this.query,
        },
        "*"
      );
    }
  }

  public static getInstance(props: WebsocketClientProps): WebsocketClient {
    const key = `${props.url}-${JSON.stringify(props.query)}`;
    if (!WebsocketClient.instances[key]) {
      WebsocketClient.instances[key] = new WebsocketClient(props);
    }
    return WebsocketClient.instances[key];
  }

  private handleEvent(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  public on(event: string, callback: EventCallback): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);

      if (chrome?.runtime?.id) {
        chrome.runtime.sendMessage({
          action: "websocket",
          value: {
            socketAction: "on",
            namespace: this.namespace,
            query: this.query,
            event,
          },
        });
      } else {
        window.postMessage(
          {
            type: "SOULSIDE_WEBSOCKET_ON",
            namespace: this.namespace,
            query: this.query,
            event,
          },
          "*"
        );
      }
    }

    const handlers = this.eventHandlers.get(event);
    handlers?.push(callback);
  }

  public emit(event: string, data: any): void {
    if (chrome?.runtime?.id) {
      chrome.runtime.sendMessage({
        action: "websocket",
        value: {
          socketAction: "emit",
          namespace: this.namespace,
          query: this.query,
          event,
          data,
        },
      });
    } else {
      window.postMessage(
        {
          type: "SOULSIDE_WEBSOCKET_EMIT",
          namespace: this.namespace,
          query: this.query,
          event,
          data,
        },
        "*"
      );
    }
  }

  public disconnect(): void {
    if (chrome?.runtime?.id) {
      chrome.runtime.sendMessage({
        action: "websocket",
        value: {
          socketAction: "disconnect",
          namespace: this.namespace,
          query: this.query,
        },
      });
    } else {
      window.postMessage(
        {
          type: "SOULSIDE_WEBSOCKET_DISCONNECT",
          namespace: this.namespace,
          query: this.query,
        },
        "*"
      );
    }

    const key = `${this.namespace}-${JSON.stringify(this.query)}`;
    delete WebsocketClient.instances[key];
    this.eventHandlers.clear();
  }
}
