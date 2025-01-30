import RichTextEditor from "@/components/RichTextEditor";
import { SessionNotes } from "@/domains/sessionNotes";
import { copyToClipboard } from "@/utils/helpers";
import { ContentCopy } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";

interface SoapNotesProps {
  notesData: SessionNotes | null;
}

const SoapNotes: React.FC<SoapNotesProps> = ({ notesData }): React.ReactNode => {
  const [textCopied, setTextCopied] = useState(false);
  const copyData = () => {
    let text = notesData?.soapNote ?? "";
    copyToClipboard(text);
    setTextCopied(true);
    setTimeout(() => {
      setTextCopied(false);
    }, 3000);
  };
  if (!notesData?.soapNote) {
    return (
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          alignItems: "center",
          justifyContent: "center",
          mt: 5,
        }}
      >
        <Typography variant={"subtitle2"}>Notes not generated yet</Typography>
      </Box>
    );
  }
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
        value={notesData?.soapNote ?? ""}
        readOnly
      />
    </Box>
  );
};

export default SoapNotes;
