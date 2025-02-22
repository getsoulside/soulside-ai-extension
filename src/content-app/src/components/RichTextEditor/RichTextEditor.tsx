import { Box, useTheme } from "@mui/material";
import { useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface QuillOptions {
  clipboard: {
    matchVisual: boolean;
  };
  toolbar?: string;
}

interface RichTextEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

const RichTextEditor = ({ value, onChange, readOnly }: RichTextEditorProps) => {
  let modules: QuillOptions = {
    clipboard: {
      matchVisual: true,
    },
  };
  if (readOnly) {
    modules = {
      ...modules,
      toolbar: "",
    };
  }
  const quill = useRef<ReactQuill>();
  const theme = useTheme();
  return (
    <Box
      sx={{
        flex: 1,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Box
        component={ReactQuill}
        ref={quill as React.RefObject<ReactQuill>}
        theme="snow"
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        modules={modules}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          [`& .ql-container`]: {
            flex: 1,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            fontFamily: theme.typography.fontFamily,
          },
          [`& .ql-editor`]: {
            color: theme.palette.text.primary,
            fontSize: theme.typography.fontSize,
            lineHeight: 1.5,
          },
          [`& h2`]: {
            fontSize: "18px",
            fontWeight: 700,
            marginBottom: "10px",
            textDecoration: "underline",
          },
          [`& h3`]: {
            fontSize: "14px",
            fontWeight: 600,
          },
          [`& ul`]: {
            marginBottom: "15px",
            marginTop: "5px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            "& li": {
              fontSize: "14px",
            },
          },
        }}
      />
    </Box>
  );
};

export default RichTextEditor;
