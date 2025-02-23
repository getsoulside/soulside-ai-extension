import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { TextareaAutosize } from "@mui/base";
import useFollowUpAssessment from "./useFollowUpAssessment";
import React, { useEffect, useState } from "react";
import { convertToTitleCase, copyToClipboard } from "@/utils/helpers";
import { SessionNotes } from "@/domains/sessionNotes";
import { ContentCopy, DeleteRounded } from "@mui/icons-material";

export interface FollowUpAssessmentProps {
  notesData: SessionNotes | null;
  sessionId?: UUIDString;
  onNotesChange?: (sessionNotes: SessionNotes) => void;
}

const listOfValuesNewItemMapping = {
  current_medications: "Medication",
  "Current Diagnosis": "Diagnosis",
  "Suggested ICD & CPT codes": "Code",
  follow_up_plans: "Plan",
};

const FollowUpAssessment: React.FC<FollowUpAssessmentProps> = ({
  notesData,
  sessionId,
  onNotesChange,
}): React.ReactNode => {
  const [textCopiedSection, setTextCopiedSection] = useState("");
  const { followUpNotesData, sortSections } = useFollowUpAssessment({ notesData, sessionId });
  useEffect(() => {
    setTextCopiedSection("");
  }, []);
  let copyTimer: any = null;
  const copyText = (section: string, subSection: string, text: string) => {
    copyToClipboard(text);
    setTextCopiedSection(`${section}-${subSection}`);
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
    copyTimer = setTimeout(() => {
      setTextCopiedSection("");
    }, 3000);
  };
  const changeResultValue = (section: string, subSection: string, value: string) => {
    const data = {
      ...(notesData || {}),
      jsonSoapNote: {
        ...(notesData?.jsonSoapNote || {}),
        [section]: {
          ...(notesData?.jsonSoapNote?.[section] || {}),
          [subSection]: {
            ...(notesData?.jsonSoapNote?.[section]?.[subSection] || {}),
            result: value,
          },
        },
      },
    };
    if (onNotesChange) {
      onNotesChange(data as SessionNotes);
    }
  };
  const changeEnhancedChiefComplaintValue = (value: string) => {
    const data = {
      ...(notesData || {}),
      jsonSoapNote: {
        ...(notesData?.jsonSoapNote || {}),
        chiefCompliantEnhanced: value,
      },
    };
    if (onNotesChange) {
      onNotesChange(data as SessionNotes);
    }
  };
  const changeMultiSelectResultValue = (
    section: string,
    subSection: string,
    value: string,
    add: boolean
  ) => {
    const data = {
      ...(notesData || {}),
      jsonSoapNote: {
        ...(notesData?.jsonSoapNote || {}),
        [section]: {
          ...(notesData?.jsonSoapNote?.[section] || {}),
          [subSection]: {
            ...(notesData?.jsonSoapNote?.[section]?.[subSection] || {}),
            result: add
              ? [...(notesData?.jsonSoapNote?.[section]?.[subSection]?.result || []), value]
              : (notesData?.jsonSoapNote?.[section]?.[subSection]?.result || []).filter(
                  (i: string) => i !== value
                ),
          },
        },
      },
    };
    if (onNotesChange) {
      onNotesChange(data as SessionNotes);
    }
  };
  const addNewListItem = (section: string, subSection: string) => {
    const data = {
      ...(notesData || {}),
      jsonSoapNote: {
        ...(notesData?.jsonSoapNote || {}),
        [section]: {
          ...(notesData?.jsonSoapNote?.[section] || {}),
          [subSection]: {
            ...(notesData?.jsonSoapNote?.[section]?.[subSection] || {}),
            result: [...(notesData?.jsonSoapNote?.[section]?.[subSection]?.result || []), ""],
          },
        },
      },
    };
    if (onNotesChange) {
      onNotesChange(data as SessionNotes);
    }
  };
  const deleteListItem = (section: string, subSection: string, index: number) => {
    const data = {
      ...(notesData || {}),
      jsonSoapNote: {
        ...(notesData?.jsonSoapNote || {}),
        [section]: {
          ...(notesData?.jsonSoapNote?.[section] || {}),
          [subSection]: {
            ...(notesData?.jsonSoapNote?.[section]?.[subSection] || {}),
            result: (notesData?.jsonSoapNote?.[section]?.[subSection]?.result || [])
              .slice(0, index)
              .concat(
                (notesData?.jsonSoapNote?.[section]?.[subSection]?.result || []).slice(
                  index + 1,
                  (notesData?.jsonSoapNote?.[section]?.[subSection]?.result || []).length
                )
              ),
          },
        },
      },
    };
    if (onNotesChange) {
      onNotesChange(data as SessionNotes);
    }
  };
  const changeListItemValue = (
    section: string,
    subSection: string,
    index: number,
    value: string
  ) => {
    const data = {
      ...(notesData || {}),
      jsonSoapNote: {
        ...(notesData?.jsonSoapNote || {}),
        [section]: {
          ...(notesData?.jsonSoapNote?.[section] || {}),
          [subSection]: {
            ...(notesData?.jsonSoapNote?.[section]?.[subSection] || {}),
            result: (notesData?.jsonSoapNote?.[section]?.[subSection]?.result || []).map(
              (i: string, listIndex: number) => {
                if (listIndex === index) {
                  return value;
                }
                return i;
              }
            ),
          },
        },
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
        gap: 1,
      }}
    >
      {followUpNotesData.map((section: any) => {
        if (!section.data) {
          return <React.Fragment key={section.label}></React.Fragment>;
        }
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
                fontWeight: "bold",
                textDecoration: "underline",
              }}
            >
              {section.label}:
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              {Object.keys(section.data)
                .sort((subSection1, subSection2) =>
                  sortSections(subSection1, subSection2, section.label)
                )
                .filter(subSection => subSection !== "homework_assignments")
                .map((subSection: string, index: number) => {
                  const chiefComplaintValue =
                    subSection === "chief_complaint"
                      ? (notesData?.jsonSoapNote || {}).hasOwnProperty("chiefCompliantEnhanced")
                        ? (notesData?.jsonSoapNote || {}).chiefCompliantEnhanced
                        : section.data[subSection].result
                      : "";
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
                          <Button
                            variant="text"
                            color="primary"
                            onClick={() =>
                              copyText(
                                "subjective",
                                subSection,
                                subSection === "chief_complaint"
                                  ? chiefComplaintValue || ""
                                  : section.data[subSection].result || ""
                              )
                            }
                            size="small"
                            startIcon={<ContentCopy />}
                          >
                            {textCopiedSection === `subjective-${subSection}` ? "Copied" : "Copy"}
                          </Button>
                        )}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
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
                              readOnly={!onNotesChange}
                              onChange={e =>
                                subSection === "chief_complaint" &&
                                (notesData?.jsonSoapNote || {}).hasOwnProperty(
                                  "chiefCompliantEnhanced"
                                )
                                  ? changeEnhancedChiefComplaintValue(e.target.value)
                                  : changeResultValue(
                                      section.label.toLowerCase(),
                                      subSection,
                                      e.target.value
                                    )
                              }
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
                          <RadioGroup sx={{ flexDirection: "row", gap: 2, mt: 0 }}>
                            {section.data[subSection].values_identified
                              .concat(section.data[subSection].values_remaining)
                              .concat(
                                !section.data[subSection].values_identified.includes(
                                  section.data[subSection].result
                                ) &&
                                  !section.data[subSection].values_remaining.includes(
                                    section.data[subSection].result
                                  ) &&
                                  section.data[subSection].result
                                  ? [section.data[subSection].result]
                                  : []
                              )
                              .map((value: string) => {
                                return (
                                  <FormControlLabel
                                    value={value}
                                    control={
                                      <Radio
                                        readOnly={!onNotesChange}
                                        sx={{ p: 0 }}
                                        onChange={() =>
                                          changeResultValue(
                                            section.label.toLowerCase(),
                                            subSection,
                                            value
                                          )
                                        }
                                      />
                                    }
                                    sx={{
                                      m: 0,
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                    label={value}
                                    checked={section.data[subSection].result === value}
                                  />
                                );
                              })}
                          </RadioGroup>
                        )}
                        {section.data[subSection].type === "multiple_choice_answers" && (
                          <RadioGroup sx={{ flexDirection: "row", gap: 2, mt: 0 }}>
                            {section.data[subSection].values_identified
                              .concat(section.data[subSection].values_remaining)
                              .map((value: string) => {
                                return (
                                  <FormControlLabel
                                    value={value}
                                    control={
                                      <Checkbox
                                        readOnly={!onNotesChange}
                                        sx={{ p: 0, m: 0, opacity: 0.9 }}
                                        onChange={() =>
                                          changeMultiSelectResultValue(
                                            section.label.toLowerCase(),
                                            subSection,
                                            value,
                                            !section.data[subSection].result?.includes(value)
                                          )
                                        }
                                      />
                                    }
                                    label={value}
                                    sx={{
                                      m: 0,
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
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
                                          {subSection === "current_medications" ? (
                                            <Stack
                                              justifyContent={"space-between"}
                                              alignContent={"center"}
                                              direction={"row"}
                                              sx={{ width: "100%" }}
                                            >
                                              <TextField
                                                value={value}
                                                sx={{ fontSize: "0.875rem", flex: 1 }}
                                                disabled={!onNotesChange}
                                                onChange={e =>
                                                  changeListItemValue(
                                                    section.label.toLowerCase(),
                                                    subSection,
                                                    index,
                                                    e.target.value
                                                  )
                                                }
                                              />
                                              {onNotesChange && (
                                                <Tooltip title="Delete">
                                                  <IconButton
                                                    onClick={() =>
                                                      deleteListItem(
                                                        section.label.toLowerCase(),
                                                        subSection,
                                                        index
                                                      )
                                                    }
                                                  >
                                                    <DeleteRounded />
                                                  </IconButton>
                                                </Tooltip>
                                              )}
                                            </Stack>
                                          ) : (
                                            <Typography variant="body1">{value}</Typography>
                                          )}
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
                            {subSection === "current_medications" && (
                              <Typography
                                variant="subtitle2"
                                sx={{ textDecoration: "underline", cursor: "pointer" }}
                                color="primary"
                                onClick={() =>
                                  addNewListItem(section.label.toLowerCase(), subSection)
                                }
                              >
                                + Add {listOfValuesNewItemMapping[subSection] || ""}
                              </Typography>
                            )}
                          </>
                        )}
                      </Box>
                      {section.data[subSection].explanation && (
                        <Box>
                          <Box>
                            <Typography
                              variant="caption"
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
      })}
    </Box>
  );
};

export default FollowUpAssessment;
