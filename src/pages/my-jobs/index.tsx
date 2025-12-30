import { useState, type JSX } from "react";
import { Box, Tabs, Tab, Stack } from "@mui/material";
import ServiceProviderLayout from "../../layouts/ServiceProviderLayout";
import JobCard from "../../components/reusecard/JobCard";

const jobs = [
  {
    id: 1,
    title: "Plumbing Repair",
    description: "Fix a leaking kitchen faucet",
    clientName: "Sarah Johnson",
    clientEmail: "sarah@email.com",
    clientPhone: "+1 234 567 890",
  },
  {
    id: 2,
    title: "Plumbing Repair",
    description: "Fix a leaking kitchen faucet",
    clientName: "Sarah Johnson",
    clientEmail: "sarah@email.com",
    clientPhone: "+1 234 567 890",
  },
];

export default function MyJobsPage(): JSX.Element {
  const [tab, setTab] = useState(0);

  return (
    <ServiceProviderLayout>
      <Box sx={{ p: { xs: 1.5, md: 3 }, width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
        {/* Pills */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            mb: 3,
            "& .MuiTab-root": {
              textTransform: "none",
              minHeight: 36,
              borderRadius: 20,
            },
            "& .Mui-selected": {
              backgroundColor: "#D2E7FF",
              color: "#1C1C1C",
            },
          }}
        >
          <Tab label="Leads" />
          <Tab label="Completed" />
          <Tab label="Declined" />
        </Tabs>

        <Stack spacing={2}>
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              {...job}
              showActions={tab === 0}
              onComplete={() => console.log("Complete", job.id)}
              onDecline={() => console.log("Decline", job.id)}
              onViewDetails={() => console.log("View", job.id)}
            />
          ))}
        </Stack>
      </Box>
    </ServiceProviderLayout>
  );
}
