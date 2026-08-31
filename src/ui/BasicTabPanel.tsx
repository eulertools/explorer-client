import React from 'react';

interface BasicTabPanelProps {
  children: React.ReactChild;
  value: string | number;
  index: string | number;
  className?: string;
}

export function BasicTabPanel(props: BasicTabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}
