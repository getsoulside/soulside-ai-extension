import httpClient from "@/utils/httpClient";
import { toast } from "react-toastify";

export const sendSms = async (phoneNumber: string, message: string): Promise<void> => {
  if (!phoneNumber) {
    return Promise.reject({ message: "Please enter phone number" });
  }
  const url = `practitioner-role/patient/send-text-to-phone`;
  const payload = {
    mode: "AUTO",
    contactPhone: phoneNumber,
    text: message,
  };
  try {
    const response = await httpClient.post(url, payload);
    toast.success("SMS sent");
    return response.data;
  } catch (error) {
    console.error(error);
    toast.error("Error sending SMS, please verify the phone number");
    return Promise.reject({ message: "Failed to send SMS" });
  }
};
