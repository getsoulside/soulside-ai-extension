export async function parseCsv(pdfUrl: string): Promise<any> {
  return new Promise((resolve, reject) => {
    if (chrome?.runtime?.id) {
      chrome.runtime.sendMessage({ action: "parseCsv", pdfUrl }, response => {
        window.postMessage(
          { type: "ADD_LOG_ROCKET_LOG", message: `parseCsv:`, data: { pdfUrl, response } },
          "*"
        );
        if (response.success) {
          resolve(response.value);
        } else {
          reject(response.value);
        }
      });
    } else {
      const requestId = Date.now() + Math.random(); // Generate a unique requestId

      // Create a message listener
      function handleMessage(event: MessageEvent): void {
        const data = event.data;
        // Ensure the message contains the requestId
        if (data.type === "SOULSIDE_PARSE_PDF_RESULT" && data.requestId === requestId) {
          window.removeEventListener("message", handleMessage); // Clean up the listener
          if (data.success) {
            resolve(data.value);
          } else {
            reject(data.value);
          }
        }
      }

      // Listen for the response
      window.addEventListener("message", handleMessage);

      // Post the request to the window
      window.postMessage({ type: "SOULSIDE_PARSE_PDF", pdfUrl, requestId }, "*");

      // Optional: Add a timeout to reject the promise if no response is received
      setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        reject("Request timed out");
      }, 10 * 1000);
    }
  });
}

export async function unParseCsv(csvData: any): Promise<any> {
  return new Promise((resolve, reject) => {
    if (chrome?.runtime?.id) {
      chrome.runtime.sendMessage({ action: "unParseCsv", csvData }, response => {
        window.postMessage(
          { type: "ADD_LOG_ROCKET_LOG", message: `unParseCsv:`, data: { csvData, response } },
          "*"
        );
        if (response.success) {
          resolve(response.value);
        } else {
          reject(response.value);
        }
      });
    } else {
      const requestId = Date.now() + Math.random(); // Generate a unique requestId

      // Create a message listener
      function handleMessage(event: MessageEvent): void {
        const data = event.data;
        // Ensure the message contains the requestId
        if (data.type === "SOULSIDE_UNPARSE_CSV_RESULT" && data.requestId === requestId) {
          window.removeEventListener("message", handleMessage); // Clean up the listener
          if (data.success) {
            resolve(data.value);
          } else {
            reject(data.value);
          }
        }
      }

      // Listen for the response
      window.addEventListener("message", handleMessage);

      // Post the request to the window
      window.postMessage({ type: "SOULSIDE_UNPARSE_CSV", csvData, requestId }, "*");

      // Optional: Add a timeout to reject the promise if no response is received
      setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        reject("Request timed out");
      }, 10 * 1000);
    }
  });
}
