import React, { useState, useEffect } from "react";
import useSoapNotesData, { convertToTitleCase } from "./useSoapNotesData";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { TextareaAutosize } from "@mui/base";

function copyTextToClipboard(text: string) {
  // Create a temporary textarea element
  const textarea = document.createElement("textarea");

  // Set the textarea value to the text you want to copy
  textarea.value = text;

  // Add the textarea to the document
  document.body.appendChild(textarea);

  // Select the text in the textarea
  textarea.select();

  // Copy the selected text to the clipboard
  try {
    document.execCommand("copy");
    console.log("Text copied to clipboard");
  } catch (err) {
    console.error("Failed to copy text", err);
  }

  // Remove the textarea from the document
  document.body.removeChild(textarea);
}

const listOfValuesNewItemMapping = {
  current_medications: "Medication",
  "Current Diagnosis": "Diagnosis",
  "Suggested ICD & CPT codes": "Code",
  follow_up_plans: "Plan",
};

function SoapNotesTemplate(props: any) {
  const [textCopiedSection, setTextCopiedSection] = useState("");
  const { notesData, sortSections } = useSoapNotesData({
    data: props.data,
    sessionData: props.sessionData,
  });
  useEffect(() => {
    setTextCopiedSection("");
  }, []);
  let copyTimer: any = null;
  const copyText = (section: string, subSection: string, text: string) => {
    copyTextToClipboard(text);
    setTextCopiedSection(`${section}-${subSection}`);
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
    copyTimer = setTimeout(() => {
      setTextCopiedSection("");
    }, 3000);
  };

  return (
    <Box
      sx={{
        flex: 1,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 0.5,
      }}
    >
      {notesData.map(section => {
        if (!!section.data) {
          return (
            <Box
              key={section.label}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  textDecoration: "underline",
                }}
              >
                {section.label}:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  paddingLeft: 0.5,
                }}
              >
                {Object.keys(section.data)
                  .sort((subSection1, subSection2) =>
                    sortSections(subSection1, subSection2, section.label)
                  )
                  .filter(subSection => subSection !== "homework_assignments")
                  .map((subSection, index) => {
                    let chiefComplaintValue =
                      subSection === "chief_complaint" ? section.data[subSection].result : "";
                    if (props.data?.chiefCompliantEnhanced) {
                      chiefComplaintValue = props.data.chiefCompliantEnhanced;
                    }
                    if (notesData)
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600 }}
                            >
                              {convertToTitleCase(subSection)}:{" "}
                            </Typography>
                            {(section.data[subSection].type === "paragraph" ||
                              section.data[subSection].type === "single_line_text") && (
                              <Box
                                onClick={() =>
                                  copyText(
                                    "subjective",
                                    subSection,
                                    subSection === "chief_complaint"
                                      ? chiefComplaintValue || ""
                                      : section.data[subSection].result || ""
                                  )
                                }
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  cursor: "pointer",
                                }}
                              >
                                <Typography variant="caption">
                                  {textCopiedSection === `subjective-${subSection}`
                                    ? "Copied"
                                    : "Copy"}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                              // paddingLeft: "15px",
                            }}
                          >
                            {section.data[subSection].type === "paragraph" && (
                              <FormControl
                                fullWidth
                                required
                              >
                                <TextareaAutosize
                                  value={
                                    subSection === "chief_complaint"
                                      ? chiefComplaintValue
                                      : section.data[subSection].result
                                  }
                                  readOnly={true}
                                  minRows={3}
                                  maxRows={10}
                                />
                              </FormControl>
                            )}
                            {section.data[subSection].type === "single_line_text" && (
                              <TextField
                                value={section.data[subSection].result}
                                sx={{
                                  fontSize: "0.875rem",
                                }}
                                disabled
                              />
                            )}
                            {section.data[subSection].type === "single_choice_answer" && (
                              <RadioGroup sx={{ flexDirection: "row", gap: 0 }}>
                                {section.data[subSection].values_identified
                                  .concat(section.data[subSection].values_remaining)
                                  .map((value: string) => {
                                    return (
                                      <FormControlLabel
                                        value={value}
                                        control={<Radio readOnly />}
                                        label={value}
                                        checked={section.data[subSection].result === value}
                                      />
                                    );
                                  })}
                              </RadioGroup>
                            )}
                            {section.data[subSection].type === "multiple_choice_answers" && (
                              <RadioGroup sx={{ flexDirection: "row", gap: 0 }}>
                                {section.data[subSection].values_identified
                                  .concat(section.data[subSection].values_remaining)
                                  .map((value: string) => {
                                    return (
                                      <FormControlLabel
                                        value={value}
                                        control={<Checkbox readOnly />}
                                        label={value}
                                        checked={section.data[subSection].result?.includes(value)}
                                      />
                                    );
                                  })}
                              </RadioGroup>
                            )}
                            {section.data[subSection].type === "list_of_values" && (
                              <>
                                {section.data[subSection].result?.length > 0 ? (
                                  <>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 0.5,
                                        padding: 1,
                                        background: "#fff",
                                        borderRadius: "5px",
                                        backdropFilter: "blur(5px)",
                                        border: "0.5px solid rgba(48, 79, 109, 0.8)",
                                      }}
                                    >
                                      {section.data[subSection].result.map(
                                        (value: string, index: number) => {
                                          return (
                                            <Box
                                              key={index}
                                              sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                gap: "5px",
                                              }}
                                            >
                                              <Typography variant="body1">{value}</Typography>
                                            </Box>
                                          );
                                        }
                                      )}
                                    </Box>
                                  </>
                                ) : (
                                  <Box>
                                    <Typography variant="body1">
                                      {section.data[subSection].explanation || "Not Identified"}
                                    </Typography>
                                  </Box>
                                )}
                              </>
                            )}
                          </Box>
                          {section.data[subSection].explanation && (
                            <Box>
                              <Box>
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 600, lineHeight: "1" }}
                                  component={"span"}
                                >
                                  Explanation:
                                </Typography>{" "}
                                <Typography
                                  variant="caption"
                                  component={"span"}
                                  sx={{ lineHeight: "1" }}
                                >
                                  {section.data[subSection].explanation}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      );
                  })}
              </Box>
            </Box>
          );
        }
        return <React.Fragment key={section.label}></React.Fragment>;
      })}
    </Box>
  );
}

export default SoapNotesTemplate;
