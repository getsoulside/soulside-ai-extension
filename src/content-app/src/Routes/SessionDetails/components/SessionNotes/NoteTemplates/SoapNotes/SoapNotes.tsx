import RichTextEditor from "@/components/RichTextEditor";
import { SessionNotes } from "@/domains/sessionNotes";
import { SessionNotesTemplates } from "@/domains/sessionNotes/models/sessionNotes.types";
import { copyToClipboard } from "@/utils/helpers";
import { ContentCopy } from "@mui/icons-material";
import { Box, Button, Stack } from "@mui/material";
import { useState } from "react";

interface SoapNotesProps {
  notesData: SessionNotes | null;
  sessionId: UUIDString;
  onNotesChange?: (sessionNotes: SessionNotes) => void;
}

const SoapNotes: React.FC<SoapNotesProps> = ({ notesData, onNotesChange }): React.ReactNode => {
  const [textCopied, setTextCopied] = useState(false);
  const copyData = () => {
    let text = notesData?.jsonSoapNote?.[SessionNotesTemplates.SOAP_PSYCHIATRY] ?? "";
    copyToClipboard(text);
    setTextCopied(true);
    setTimeout(() => {
      setTextCopied(false);
    }, 3000);
  };
  const onChange = (value: string) => {
    const data = {
      ...(notesData || {}),
      jsonSoapNote: {
        ...(notesData?.jsonSoapNote || {}),
        [SessionNotesTemplates.SOAP_PSYCHIATRY]: value,
      },
    };
    if (onNotesChange) {
      onNotesChange(data as SessionNotes);
    }
  };
  return (
    <Box
      sx={{
        flex: 1,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent={"flex-end"}
      >
        <Button
          variant="text"
          color="primary"
          onClick={copyData}
          size="small"
          startIcon={<ContentCopy />}
        >
          {textCopied ? "Copied" : "Copy Notes"}
        </Button>
      </Stack>
      <RichTextEditor
        value={notesData?.jsonSoapNote?.[SessionNotesTemplates.SOAP_PSYCHIATRY] ?? ""}
        onChange={onChange}
        readOnly={!onNotesChange}
      />
    </Box>
  );
};

export default SoapNotes;
