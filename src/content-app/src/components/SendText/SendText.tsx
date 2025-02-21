import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Loader from "@/components/Loader";
import useSendText from "./useSendText";

export interface SendTextProps {
  open: boolean;
  onClose: () => void;
  phoneNumber: string;
  smsMsg: string;
  title?: string;
  phoneNumberLabel?: string;
}

const SendText: React.FC<SendTextProps> = (props): React.ReactNode => {
  const { phoneNumber, setPhoneNumber, smsMsg, setSmsMsg, loading, sendMessage } =
    useSendText(props);
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      fullWidth
    >
      <DialogTitle>{props.title || "Send Text"}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
        <FormControl
          fullWidth
          required
        >
          <FormLabel>{props.phoneNumberLabel || "Phone Number"}</FormLabel>
          <TextField
            value={phoneNumber}
            onChange={event => setPhoneNumber(event.target.value)}
            placeholder="(201) 555-0123"
          />
        </FormControl>
        <FormControl
          fullWidth
          required
        >
          <FormLabel>Message</FormLabel>
          <TextareaAutosize
            value={smsMsg}
            onChange={event => setSmsMsg(event.target.value)}
            placeholder="Enter your message here"
            minRows={10}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <LoadingButton
          variant="contained"
          onClick={sendMessage}
          disabled={!phoneNumber || !smsMsg}
          loading={loading}
          loadingPosition="center"
          loadingIndicator={
            <Loader
              loading={loading}
              size={"small"}
            />
          }
        >
          Send SMS
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default SendText;
