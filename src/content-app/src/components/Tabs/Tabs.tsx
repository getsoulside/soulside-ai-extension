import * as React from "react";
import MuiTabs from "@mui/material/Tabs";
import MuiTab from "@mui/material/Tab";
import Box from "@mui/material/Box";

interface TabPanelProps {
  children?: React.ReactNode;
  value: string;
  tabKey: string;
  idPrefix?: string;
}

function TabPanel({ children, tabKey, value, idPrefix, ...other }: TabPanelProps) {
  return (
    <Box
      role="tabpanel"
      hidden={tabKey !== value}
      id={`${idPrefix ? `${idPrefix}-` : ""}tab-panel-${value}`}
      aria-labelledby={`${idPrefix ? `${idPrefix}-` : ""}tab-${value}`}
      {...other}
      sx={{
        maxHeight: "100%",
        overflow: "auto",
        display: value === tabKey ? "flex" : "none",
        flexDirection: "column",
        flex: 1,
        "&[hidden]": {
          flex: "unset",
          p: 0,
        },
      }}
    >
      {children}
    </Box>
  );
}

function getTabProps(tabKey: string, idPrefix?: string) {
  return {
    id: `${idPrefix ? `${idPrefix}-` : ""}${tabKey}`,
    "aria-controls": `${idPrefix ? `${idPrefix}-` : ""}${tabKey}`,
  };
}

export interface TabItem {
  label: string;
  content: React.ReactNode | JSX.Element | null;
  key: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab?: string;
  idPrefix?: string;
  onChange?: (tabKey: string) => void;
  rightAction?: React.ReactNode;
}

const Tabs = ({ tabs, activeTab, onChange, idPrefix, rightAction }: TabsProps) => {
  const [internalValue, setInternalValue] = React.useState("");
  const value = activeTab ?? internalValue;

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        maxHeight: "100%",
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <MuiTabs
          value={value}
          onChange={handleChange}
          aria-label="tabs"
        >
          {tabs.map(tab => (
            <MuiTab
              key={tab.key}
              label={tab.label}
              value={tab.key}
              {...getTabProps(tab.key, idPrefix)}
            />
          ))}
        </MuiTabs>
        {!!rightAction && rightAction}
      </Box>
      {tabs.map(tab => (
        <TabPanel
          key={tab.key}
          value={value}
          tabKey={tab.key}
          idPrefix={idPrefix}
        >
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
};

export default Tabs;
