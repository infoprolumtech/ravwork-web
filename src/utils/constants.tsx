export const colors = {
  // Health-Nav
  "Base-White": "#FFFFFF",
  "Base-Black": "#000000",
  "Gray-50": "#F9FAFB",
  "Gray-100": "#F3F4F6",
  "Gray-200": "#E5E7EB",
  "Gray-300": "#D2D6DB",
  "Gray-400": "#9DA4AE",
  "Gray-500": "#6C737F",
  "Gray-600": "#4D5761",
  "Gray-700": "#384250",
  "Gray-800": "#1F2A37",
  "Gray-900": "#111927",
  "Gray-1000": "#475467",
  "Primary-50": "#e3f0f8",
  "Primary-100": "#bad8ef",
  "Primary-200": "#90c0e5",
  "Primary-300": "#69a8d9",
  "Primary-400": "#4e97d3",
  "Primary-500": "#3786cc",
  "Primary-600": "#307abf",
  "Primary-700": "#2869ad",
  "Primary-800": "#21599b",
  "Primary-900": "#153c7c",
  "Error-50": "#FEF3F2",
  "Error-100": "#FEE4E2",
  "Error-200": "#FECDCA",
  "Error-300": "#FDA29B",
  "Error-400": "#F97066",
  "Error-500": "#F04438",
  "Error-600": "#D92D20",
  "Error-700": "#B42318",
  "Error-800": "#912018",
  "Error-900": "#7A271A",
  "Warning-50": "#FFFAEB",
  "Warning-100": "#FEF0C7",
  "Warning-200": "#FEDF89",
  "Warning-300": "#FEC84B",
  "Warning-400": "#FDB022",
  "Warning-500": "#F79009",
  "Warning-600": "#DC6803",
  "Warning-700": "#B54708",
  "Warning-800": "#93370D",
  "Warning-900": "#7A2E0E",
  "Success-50": "#ECFDF3",
  "Success-100": "#D1FADF",
  "Success-200": "#A6F4C5",
  "Success-300": "#6CE9A6",
  "Success-400": "#32D583",
  "Success-500": "#12B76A",
  "Success-600": "#039855",
  "Success-700": "#027A48",
  "Success-800": "#05603A",
  "Success-900": "#054F31",
};

export function getAPPUserDialogContent(type: string) {
  switch (type) {
    case "block":
      return {
        title: "Block User Account",
        subtitle: "Are you sure want to block this user’s account? Please specify the reason.",
        reason: "Block Reason"
      };
    case "delete":
      return {
        title: "Delete User Account",
        subtitle: "Are you sure want to delete this user’s account? Please specify the reason.",
        reason: "Delete Reason"
      };
    case "reactive":
      return {
        title: "Reactivate User Account",
        subtitle: "Are you sure want to reactive this user’s account? Please specify the reason.",
        reason: "Reactivate Reason"
      };
    case "blockBulk":
      return {
        title: "Block Selected User Accounts",
        subtitle: "Are you sure want to block selected user accounts? Please specify the reason.",
        reason: "Block Reason"
      };
    case "deleteBulk":
      return {
        title: "Delete Selected User Accounts",
        subtitle: "Are you sure want to delete selected user accounts? Please specify the reason.",
        reason: "Delete Reason"
      };
    case "reactiveBulk":
      return {
        title: "Reactive Selected User Accounts",
        subtitle: "Are you sure want to reactive selected user accounts? Please specify the reason.",
        reason: "Reactive Reason"
      };
    default:
      return {
        title: "",
        subtitle: "",
        reason: ""
      };
  }
}
export function getAdminUserDialogContent(type: string) {
  switch (type) {
    case "block":
      return {
        title: "Block Sub-Admin Account",
        subtitle: "Are you sure you want to block this sub-admin account? Please specify the reason.?",
        reason: "Block Reason"
      };
    case "delete":
      return {
        title: "Delete Sub-Admin Account",
        subtitle: "Are you sure you want to delete this sub-admin account? Please specify the reason.",
        reason: "Delete Reason"
      };
    case "reactive":
      return {
        title: "Reactivate Sub-Admin Account",
        subtitle: "Are you sure you want to reactive this sub-admin account? Please specify the reason.",
        reason: "Reactivate Reason"
      };
    case "blockBulk":
      return {
        title: "Block Selected Sub-Admin Accounts",
        subtitle: "Are you sure you want to block selected sub-admin accounts? Please specify the reason.",
        reason: "Block Reason"
      };
    case "deleteBulk":
      return {
        title: "Delete Selected Sub-Admin Accounts",
        subtitle: "Are you sure you want to delete selected sub-admin accounts? Please specify the reason.",
        reason: "Delete Reason"
      };
    case "reactiveBulk":
      return {
        title: "Reactive Selected Sub-Admin Accounts",
        subtitle: "Are you sure you want to reactive selected sub-admin accounts? Please specify the reason.",
        reason: "Reactive Reason"
      };
    default:
      return {
        title: "",
        subtitle: "",
        reason: ""
      };
  }
}
export function getContentLibraryDialogContent(type: string) {
  switch (type) {
    case "publish":
      return {
        title: "Publish Content",
        subtitle: "Are you sure want to publish this content on the application?",
      };
    case "delete":
      return {
        title: "Delete Content",
        subtitle: "Are you sure want to delete this content on the application?",
      };
    case "hidden":
      return {
        title: "Hide Content",
        subtitle: "Are you sure want to hide this content on the application?",
      };
    case "publishBulk":
      return {
        title: "Publish All Selected Content",
        subtitle: "Are you sure want to publish all the selected content on the application?",
      };
    case "deleteBulk":
      return {
        title: "Delete All Selected Content",
        subtitle: "Are you sure want to delete all the selected content on the application?",
      };
    case "hiddenBulk":
      return {
        title: "Hide All Selected Content",
        subtitle: "Are you sure want to hide all the selected content on the application?.",
      };
    default:
      return {
        title: "",
        subtitle: "",
      };
  }
}
export const contentLibraryFilterList = [
  {
    title: "Active",
    value: "active",
  },
  {
    title: "Hidden",
    value: "hidden",
  },

  {
    title: "Deleted",
    value: "deleted",
  },
];
export const supportStatusFilterList = [
  {
    title: "Ongoing",
    value: "ongoing",
  },
  {
    title: "Resolved",
    value: "resolved",
  },
];
export const AdminUserStatusFilterList = [
  {
    title: "Active",
    value: "active",
  },
  {
    title: "Blocked",
    value: "blocked",
  },
  {
    title: "Deleted",
    value: "deleted",
  },
];
export const AdminUserRoleFilterList = [
  {
    title: "Super Admin",
    value: "super-admin",
  },
  {
    title: "Content Moderator",
    value: "content-moderator",
  },
  {
    title: "Marketing",
    value: "marketing",
  },
  {
    title: "Compliance Officer",
    value: "compliance-officer",
  },
  {
    title: "Support Desk",
    value: "support-desk",
  }
];
export const AppUserStatusFilterList = [
  {
    title: "Active",
    value: "active",
  },
  {
    title: "Blocked",
    value: "blocked",
  },
  {
    title: "Deleted",
    value: "deleted",
  },
];

export const accessRights = [
  { label: "App users", value: "689072215b454dbe03014d93" },
  { label: "User Cohorts", value: "689072215b454dbe03014d94" },
  {
    label: "Content Moderation",
    value: "689072215b454dbe03014d95",
    children: [
      { label: "Content Library", value: "689072265b454dbe03014d9b" },
      { label: "Flagged Content Reports", value: "689072265b454dbe03014d9c" },
      { label: "Vetting Logs", value: "689072265b454dbe03014d9d" },
      { label: "Scrapper Logs", value: "689072265b454dbe03014d9e" },
      { label: "Manage Tags", value: "689072265b454dbe03014d9f" },
      { label: "Manage Categories", value: "689072265b454dbe03014da0" },
    ],
  },
  { label: "Notification Management", value: "689072215b454dbe03014d96" },
  { label: "Support Tickets", value: "689072215b454dbe03014d97" },
  {
    label: "Audit reports",
    value: "689072215b454dbe03014d98",
    children: [
      {
        label: "User Login and Security Logs",
        value: "689072265b454dbe03014da1",
      },
      { label: "Administration Logs", value: "689072265b454dbe03014da2" },
      { label: "Data Deletion Logs", value: "689072265b454dbe03014da3" },
    ],
  },
  { label: "Manage Legal Docs", value: "689072215b454dbe03014d99" },
  {
    label: "Manage Admin Users",
    value: "689072215b454dbe03014d9a",
    children: [
      { label: "Admin Users", value: "689072265b454dbe03014da4" },
      { label: "Role Access", value: "689072265b454dbe03014da5" },
    ],
  },
];