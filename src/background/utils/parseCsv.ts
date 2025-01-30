import Papa from "papaparse";
import { rawHttpClient } from "./httpClient";
import { IN_SESSION_SOCKET_URL } from "../constants/envVariables";

const parseCsv = async (pdfUrl: string) => {
  const response = await rawHttpClient.post({
    url: `${IN_SESSION_SOCKET_URL}/proxy-api`,
    data: {
      url: pdfUrl,
      method: "GET",
    },
  });
  return new Promise((resolve, reject) => {
    Papa.parse(response.data as string, {
      complete: results => resolve(results),
      error: (error: any) => reject(error),
    });
  });
};

export default parseCsv;
