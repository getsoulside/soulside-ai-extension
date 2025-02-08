import { useState } from "react";
import { intakeAssessmentTabs } from "./intakeAssessmentSchema";
import { SessionNotes } from "@/domains/sessionNotes";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
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
  Typography,
} from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { copyToClipboard } from "@/utils/helpers";

export interface IntakeAssessmentProps {
  notesData: SessionNotes | null;
}

const IntakeAssessment = ({ notesData }: IntakeAssessmentProps) => {
  const [activeTab, setActiveTab] = useState(intakeAssessmentTabs[0].name);
  const [textCopiedSection, setTextCopiedSection] = useState("");
  const intakeData = notesData?.jsonSoapNote?.["intake-assessment"] || null;
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
  if (!intakeData || !intakeData.intakeHPINote) {
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
          {intakeAssessmentTabs.map(tab => (
            <MenuItem
              key={tab.name}
              value={tab.name}
            >
              {tab.name}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Divider />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, overflow: "auto", flex: 1 }}>
        {intakeAssessmentTabs
          .find(tab => tab.name === activeTab)
          ?.content.map((content, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {content.name && (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={1}
                >
                  <Typography variant="subtitle2">{content.name}</Typography>
                  {content.type === "paragraph" && (
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() =>
                        copyText(
                          content.key,
                          intakeData?.[content.key as keyof typeof intakeData] as string | ""
                        )
                      }
                      size="small"
                      startIcon={<ContentCopy />}
                    >
                      {textCopiedSection === content.key ? "Copied" : "Copy"}
                    </Button>
                  )}
                </Stack>
              )}
              {content.type === "paragraph" && (
                <FormControl
                  fullWidth
                  required
                >
                  <TextareaAutosize
                    value={intakeData?.[content.key as keyof typeof intakeData] as string | ""}
                    readOnly={true}
                    minRows={3}
                    maxRows={15}
                  />
                </FormControl>
              )}
              {content.type === "list_of_single_choice_questions" && (
                <Stack
                  direction="column"
                  spacing={2}
                >
                  {(intakeData?.[content.key as keyof typeof intakeData] as unknown as [])?.length >
                    0 &&
                    (intakeData?.[content.key as keyof typeof intakeData] as unknown as []).map(
                      (question, index) => (
                        <SingleChoiceQuestion
                          data={question}
                          keyIndex={index}
                          key={index}
                        />
                      )
                    )}
                </Stack>
              )}
              {content.type === "single_choice_question" && (
                <Stack
                  direction="column"
                  spacing={2}
                >
                  {(intakeData?.[content.key as keyof typeof intakeData] as unknown as any)
                    ?.question && (
                    <SingleChoiceQuestion
                      data={intakeData?.[content.key as keyof typeof intakeData] as unknown as any}
                      keyIndex={0}
                    />
                  )}
                </Stack>
              )}
              {content.type === "list_of_tables" && (
                <Stack
                  direction="column"
                  spacing={2}
                >
                  {(content as any)?.tables?.map((table: any) => {
                    const tableData = (
                      intakeData?.[content.key as keyof typeof intakeData] as any
                    )?.[table.key];
                    if (!tableData || tableData.length === 0) {
                      return <></>;
                    }
                    return (
                      <IntakeTable
                        key={table.key}
                        tableName={table.name}
                        data={tableData}
                      />
                    );
                  })}
                </Stack>
              )}
              {content.type === "table" &&
                (intakeData?.[content.key as keyof typeof intakeData] as any)?.length > 0 && (
                  <IntakeTable
                    tableName={""}
                    data={intakeData?.[content.key as keyof typeof intakeData] as any}
                  />
                )}
              {content.type === "mixed_content" &&
                content?.subContent &&
                content?.subContent?.length > 0 &&
                content?.subContent.map(subContent => {
                  return (
                    <Box
                      key={`${subContent.key}-${subContent.type}`}
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      {subContent.name && (
                        <Typography variant="subtitle2">{subContent.name}</Typography>
                      )}
                      {subContent.type === "list_of_single_choice_questions" && (
                        <Stack
                          direction="column"
                          spacing={2}
                        >
                          {(
                            (intakeData?.[content.key as keyof typeof intakeData] as any)?.[
                              subContent.key as keyof typeof intakeData
                            ] as unknown as []
                          )?.length > 0 &&
                            (
                              (intakeData?.[content.key as keyof typeof intakeData] as any)?.[
                                subContent.key as keyof typeof intakeData
                              ] as unknown as []
                            ).map((question, index) => (
                              <SingleChoiceQuestion
                                data={question}
                                keyIndex={index}
                                key={index}
                              />
                            ))}
                        </Stack>
                      )}
                      {subContent.type === "single_choice_question" && (
                        <Stack
                          direction="column"
                          spacing={2}
                        >
                          {(
                            (intakeData?.[content.key as keyof typeof intakeData] as any)?.[
                              subContent.key as keyof typeof intakeData
                            ] as unknown as any
                          )?.question && (
                            <SingleChoiceQuestion
                              data={
                                (
                                  intakeData?.[
                                    content.key as keyof typeof intakeData
                                  ] as unknown as any
                                )?.[subContent.key as keyof typeof intakeData] as unknown as any
                              }
                              keyIndex={0}
                              key={0}
                            />
                          )}
                        </Stack>
                      )}
                      {subContent.type === "list_of_tables" && (
                        <Stack
                          direction="column"
                          spacing={2}
                        >
                          {(subContent as any)?.tables?.map((table: any) => {
                            const tableData = (
                              intakeData?.[content.key as keyof typeof intakeData] as any
                            )?.[subContent.key as keyof typeof intakeData]?.[table.key];
                            if (!tableData || tableData.length === 0) {
                              return <></>;
                            }
                            return (
                              <IntakeTable
                                key={table.key}
                                tableName={table.name}
                                data={tableData}
                              />
                            );
                          })}
                        </Stack>
                      )}
                      {subContent.type === "table" &&
                        (intakeData?.[content.key as keyof typeof intakeData] as any)?.[
                          subContent.key as keyof typeof intakeData
                        ]?.length > 0 && (
                          <IntakeTable
                            tableName={""}
                            data={
                              (intakeData?.[content.key as keyof typeof intakeData] as any)?.[
                                subContent.key as keyof typeof intakeData
                              ] as any
                            }
                          />
                        )}
                    </Box>
                  );
                })}
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default IntakeAssessment;

interface SingleChoiceQuestionProps {
  data: {
    question?: string;
    options?: string[];
    response?: string;
    explanation?: string;
  };
  keyIndex: number;
}

const SingleChoiceQuestion = ({ data, keyIndex }: SingleChoiceQuestionProps) => {
  return (
    <Box
      className="intake-single-choice-question"
      sx={{ gap: 1, display: "flex", flexDirection: "column" }}
    >
      <Typography variant="body1">
        <strong style={{ fontWeight: 500 }}>{keyIndex + 1}.</strong> {data?.question}
      </Typography>
      {data?.options && data?.options?.length > 0 ? (
        <RadioGroup sx={{ flexDirection: "row", gap: 2, mt: 0 }}>
          {data?.options.map((value: string) => {
            return (
              <FormControlLabel
                value={value}
                control={
                  <Radio
                    readOnly
                    sx={{ p: 0 }}
                  />
                }
                sx={{
                  m: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
                label={value}
                checked={data.response === value}
              />
            );
          })}
        </RadioGroup>
      ) : (
        <>
          {data?.response && (
            <Typography
              className="response-value"
              sx={{ mt: 0.5 }}
            >
              <strong>-</strong> {data.response}
            </Typography>
          )}
        </>
      )}
      {data?.explanation && (
        <Typography variant="caption">
          <strong style={{ fontWeight: 500 }}>Explanation:</strong> {data.explanation}
        </Typography>
      )}
    </Box>
  );
};

interface IntakeTableProps {
  data: any[];
  tableName?: string;
}

const IntakeTable = ({ data, tableName }: IntakeTableProps) => {
  let tableColumns = Object.keys(data?.[0] || {});
  return (
    <Box sx={{ mb: 1, display: "flex", flexDirection: "column", gap: 1 }}>
      {tableName && (
        <Typography
          variant="body1"
          sx={{ textDecoration: "underline" }}
        >
          {tableName}
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
                    {tableColumn}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((i, index) => {
              return (
                <TableRow
                  key={index}
                  sx={{
                    borderBottom: index === data?.length - 1 ? 0 : 1,
                    borderColor: "divider",
                  }}
                >
                  {tableColumns.map((tableColumn, index2) => {
                    return (
                      <TableCell
                        key={index2}
                        sx={{ fontSize: "0.75rem", px: 1 }}
                      >
                        {i?.[tableColumn] || ""}
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
