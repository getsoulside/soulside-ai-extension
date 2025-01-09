import { useEffect, useState } from "react";
import { SendTextProps } from "./SendText";
import { sendSms } from "@/services/communications";

const useSendText = (props: SendTextProps) => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [smsMsg, setSmsMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (props.open) {
      setPhoneNumber(props.phoneNumber || "");
      setSmsMsg(props.smsMsg || "");
    } else {
      setPhoneNumber("");
      setSmsMsg("");
    }
  }, [props.phoneNumber, props.smsMsg, props.open]);
  const sendMessage = async () => {
    if (smsMsg && phoneNumber) {
      setLoading(true);
      try {
        await sendSms(phoneNumber, smsMsg);
        props.onClose();
      } catch (error) {}
      setLoading(false);
    }
  };
  return { phoneNumber, setPhoneNumber, smsMsg, setSmsMsg, loading, sendMessage };
};

export default useSendText;
