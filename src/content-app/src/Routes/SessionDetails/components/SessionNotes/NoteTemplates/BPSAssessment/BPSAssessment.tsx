import React, { useState } from "react";
import bpsAssessmentSchema, {
  InputField,
  CheckboxField,
  ListOfValuesField,
} from "./bpsTemplateSchema";
import { SessionNotes } from "@/domains/sessionNotes";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  MenuItem,
  RadioGroup,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { copyToClipboard } from "@/utils/helpers";
import { SessionNotesTemplates } from "@/domains/sessionNotes/models/sessionNotes.types";

interface BPSAssessmentProps {
  notesData: SessionNotes | null;
  sessionId: UUIDString;
  onNotesChange?: (sessionNotes: SessionNotes) => void;
}

type InputChange = (
  value: string | boolean,
  valueKey: string,
  sectionKey: string,
  subSectionKey?: string,
  subSubSectionKey?: string
) => void;

const BPSAssessment = ({ notesData, onNotesChange }: BPSAssessmentProps) => {
  const [activeTab, setActiveTab] = useState(bpsAssessmentSchema[0].key);
  const [textCopiedSection, setTextCopiedSection] = useState("");
  const bpsData = notesData?.jsonSoapNote?.[SessionNotesTemplates.BPS];
  let copyTimer: any = null;
  const copyText = (key: string, text: string) => {
    copyToClipboard(text);
    setTextCopiedSection(key);
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
    copyTimer = setTimeout(() => {
      setTextCopiedSection("");
    }, 3000);
  };
  const handleInputChange: InputChange = (
    value,
    valueKey,
    sectionKey,
    subSectionKey,
    subSubSectionKey
  ): void => {
    const bpsData: any = notesData?.jsonSoapNote?.[SessionNotesTemplates.BPS];
    const data = {
      ...(notesData || {}),
      jsonSoapNote: {
        ...(notesData?.jsonSoapNote || {}),
        [SessionNotesTemplates.BPS]: {
          ...(notesData?.jsonSoapNote?.[SessionNotesTemplates.BPS] || {}),
          [sectionKey]: subSectionKey
            ? subSubSectionKey
              ? {
                  ...(bpsData?.[sectionKey] || {}),
                  [subSectionKey]: {
                    ...(bpsData?.[sectionKey][subSectionKey] || {}),
                    [subSubSectionKey]: {
                      ...(bpsData?.[sectionKey][subSectionKey][subSubSectionKey] || {}),
                      [valueKey]: value,
                    },
                  },
                }
              : {
                  ...(bpsData?.[sectionKey] || {}),
                  [subSectionKey]: {
                    ...(bpsData?.[sectionKey][subSectionKey] || {}),
                    [valueKey]: value,
                  },
                }
            : {
                ...(bpsData?.[sectionKey] || {}),
                [valueKey]: value,
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
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
      >
        <Typography variant="body1">Section:</Typography>
        <Select
          value={activeTab}
          onChange={e => setActiveTab(e.target.value)}
          sx={{
            flex: 1,
          }}
        >
          {bpsAssessmentSchema.map(tab => (
            <MenuItem
              key={tab.key}
              value={tab.key}
            >
              {tab.label}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Divider />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, overflow: "auto", flex: 1 }}>
        {bpsAssessmentSchema
          .find(tab => tab.key === activeTab)
          ?.value.map(subSection => (
            <Box
              key={subSection.key}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {subSection.type === "subSection" && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {subSection.label && (
                    <Typography
                      variant="subtitle2"
                      sx={{ padding: 1, backgroundColor: "background.paper", borderRadius: 1 }}
                    >
                      {subSection.label}
                    </Typography>
                  )}
                  {subSection.value.map(valueItem => {
                    if (valueItem.type === "subSubSection") {
                      return (
                        <React.Fragment key={valueItem.key}>
                          <Typography
                            variant="subtitle2"
                            sx={{ textDecoration: "underline" }}
                          >
                            {valueItem.label}
                          </Typography>
                          {valueItem.value.map(subSubSection => (
                            <BpsTemplateInput
                              key={subSubSection.key}
                              valueItem={subSubSection as InputField}
                              data={bpsData}
                              sectionKey={activeTab}
                              subSectionKey={subSection.key}
                              subSubSectionKey={valueItem.key}
                              copyText={copyText}
                              textCopiedSection={textCopiedSection}
                              readOnly={!onNotesChange}
                              handleInputChange={handleInputChange}
                            />
                          ))}
                        </React.Fragment>
                      );
                    }
                    return (
                      <BpsTemplateInput
                        key={valueItem.key}
                        valueItem={valueItem as InputField}
                        data={bpsData}
                        sectionKey={activeTab}
                        subSectionKey={subSection.key}
                        copyText={copyText}
                        textCopiedSection={textCopiedSection}
                        readOnly={!onNotesChange}
                        handleInputChange={handleInputChange}
                      />
                    );
                  })}
                </Box>
              )}
              {(subSection.type === "input" || subSection.type === "textarea") && (
                <BpsTemplateInput
                  valueItem={subSection as InputField}
                  data={bpsData}
                  sectionKey={activeTab}
                  copyText={copyText}
                  textCopiedSection={textCopiedSection}
                  readOnly={!onNotesChange}
                  handleInputChange={handleInputChange}
                />
              )}
              {subSection.type === "listOfValues" && (
                <BpsTemplateTable
                  valueItem={subSection as ListOfValuesField}
                  data={bpsData}
                  sectionKey={activeTab}
                />
              )}
              {subSection.type === "checkbox" && (
                <BpsTemplateCheckbox
                  valueItem={subSection as CheckboxField}
                  data={bpsData}
                  sectionKey={activeTab}
                  readOnly={!onNotesChange}
                  handleInputChange={handleInputChange}
                />
              )}
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default BPSAssessment;

const BpsTemplateInput = ({
  valueItem,
  data,
  sectionKey,
  subSectionKey,
  subSubSectionKey,
  copyText,
  textCopiedSection,
  readOnly,
  handleInputChange,
}: {
  valueItem: InputField;
  data: any;
  sectionKey: string;
  subSectionKey?: string;
  subSubSectionKey?: string;
  copyText: (key: string, text: string) => void;
  textCopiedSection: string;
  readOnly: boolean;
  handleInputChange: InputChange;
}) => {
  if (valueItem.type !== "input" && valueItem.type !== "textarea") {
    return null;
  }
  let value = subSectionKey
    ? (subSubSectionKey
        ? data?.[sectionKey]?.[subSectionKey]?.[subSubSectionKey]?.[valueItem.key]
        : data?.[sectionKey]?.[subSectionKey]?.[valueItem.key]) || ""
    : data?.[sectionKey]?.[valueItem.key] || "";
  let copyKey = `${sectionKey}${subSectionKey ? `-${subSectionKey}` : ""}${
    subSubSectionKey ? `-${subSubSectionKey}` : ""
  }-${valueItem.key}`;
  if (typeof value === "string" || typeof value === "number") {
    value = value.toString();
  } else if (Array.isArray(value || null)) {
    value = valueItem.type === "textarea" ? value.join("\n") : value.join(", ");
  }
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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
          {valueItem.label}
        </Typography>
        <Button
          variant="text"
          color="primary"
          onClick={() => copyText(copyKey, value)}
          size="small"
          startIcon={<ContentCopy />}
        >
          {textCopiedSection === copyKey ? "Copied" : "Copy"}
        </Button>
      </Box>
      {valueItem.type === "input" && (
        <TextField
          value={value}
          sx={{
            fontSize: "0.875rem",
          }}
          disabled={!!readOnly}
          onChange={e =>
            handleInputChange(
              e.target.value,
              valueItem.key,
              sectionKey,
              subSectionKey,
              subSubSectionKey
            )
          }
        />
      )}
      {valueItem.type === "textarea" && (
        <FormControl
          fullWidth
          required
        >
          <TextareaAutosize
            value={value}
            readOnly={!!readOnly}
            minRows={1}
            maxRows={10}
            onChange={e =>
              handleInputChange(
                e.target.value,
                valueItem.key,
                sectionKey,
                subSectionKey,
                subSubSectionKey
              )
            }
          />
        </FormControl>
      )}
    </Box>
  );
};

const BpsTemplateTable = ({
  valueItem,
  data,
  sectionKey,
}: {
  valueItem: ListOfValuesField;
  data: any;
  sectionKey: string;
}) => {
  let tableColumns = valueItem?.value || [];
  return (
    <Box sx={{ mb: 1, display: "flex", flexDirection: "column", gap: 1 }}>
      {valueItem.label && (
        <Typography
          variant="subtitle2"
          sx={{ padding: 1, backgroundColor: "background.paper", borderRadius: 1 }}
        >
          {valueItem.label}
        </Typography>
      )}
      <TableContainer>
        <Table size="small">
          <TableHead sx={{ backgroundColor: "background.paper" }}>
            <TableRow>
              {tableColumns.map((tableColumn, index) => {
                return (
                  <TableCell
                    key={index}
                    sx={{ fontSize: "0.75rem", px: 1 }}
                  >
                    {tableColumn.label}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.[sectionKey]?.[valueItem.key]?.map((i: any, index: number) => {
              return (
                <TableRow
                  key={index}
                  sx={{
                    borderBottom: index === data?.[sectionKey]?.[valueItem.key]?.length - 1 ? 0 : 1,
                    borderColor: "divider",
                  }}
                >
                  {tableColumns.map((tableColumn, index2) => {
                    return (
                      <TableCell
                        key={index2}
                        sx={{ fontSize: "0.75rem", px: 1 }}
                      >
                        {i?.[tableColumn.key] || ""}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const BpsTemplateCheckbox = ({
  valueItem,
  data,
  sectionKey,
  readOnly,
  handleInputChange,
}: {
  valueItem: CheckboxField;
  data: any;
  sectionKey: string;
  readOnly: boolean;
  handleInputChange: InputChange;
}) => {
  return (
    <RadioGroup sx={{ flexDirection: "row", gap: 2, mt: 0 }}>
      <FormControlLabel
        value={valueItem.label}
        control={
          <Checkbox
            readOnly={!!readOnly}
            sx={{ p: 0, m: 0, opacity: 0.9 }}
            onChange={() =>
              handleInputChange(!data?.[sectionKey]?.[valueItem.key], valueItem.key, sectionKey)
            }
          />
        }
        label={valueItem.label}
        sx={{
          m: 0,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
        checked={data?.[sectionKey]?.[valueItem.key] || false}
      />
    </RadioGroup>
  );
};
