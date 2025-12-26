
import type { JSX } from "react";

// types.ts

//common column interface for generic use
export interface Column<T> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: any) => string;
  sortable?: boolean;
  filterOptions?: string[];
}
// defination of user columns
export type UserData = {
  name: string;
  email: string;
  pNumber: string;
  date: string;
  status: string;
  action: JSX.Element;
};
export const userColumns: readonly Column<UserData>[] = [
  { id: "name", label: "Full Name", minWidth: 170, sortable: true },
  { id: "email", label: "Email Address", minWidth: 170, sortable: true },
  {
    id: "pNumber",
    label: "Mobile Number",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "date",
    label: "Registration Date",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toLocaleString("en-US"),
    sortable: true,
  },
  {
    id: "status",
    label: "Status",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toFixed(2),
    sortable: false,
    filterOptions: ["inactive", "active"],
  },
  {
    id: "action",
    label: "Action",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toFixed(2),
  },
];

export type AppUserData = {
  userId: string;
  fullName: string | null;
  phoneNumber: string | null;
  email: string | null;
  status: JSX.Element;
  action: JSX.Element;
};
export const AppUserColumns: readonly Column<AppUserData>[] = [
  { id: "userId", label: "User ID", minWidth: 100, sortable: false },
  { id: "fullName", label: "Name", minWidth: 100, sortable: false },
  { id: "phoneNumber", label: "Phone Number", minWidth: 150, sortable: false },
  { id: "email", label: "Email Address", minWidth: 170, sortable: false },
  { id: "status", label: "Status", minWidth: 70, sortable: false },
  { id: "action", label: "", minWidth: 50, sortable: false },
];
export function createAppUserData(
  userId: string,
  fullName: string | null,
  email: string | null,
  phoneNumber: string | null,
  status: JSX.Element,
  action: JSX.Element
): AppUserData {
  return {
    userId,
    fullName,
    phoneNumber,
    email,
    status,
    action,
  };
}
//*********************************************************************************************** */
// Audit Report Types
//  User Login & Security Event Logs
export type UserLoginSecurityEvent = {
  logId: string;
  userId: string;
  eventType: string;
  outcome: string;
  dateTime: string;
  ipAddress: string;
  deviceInfo: string;
};
export const userLoginSecurityColumns: readonly Column<UserLoginSecurityEvent>[] =
  [
    { id: "logId", label: "Log ID", minWidth: 120, },
    { id: "userId", label: "User ID", minWidth: 120, },
    { id: "eventType", label: "Event Type", minWidth: 150 },
    { id: "outcome", label: "Outcome", minWidth: 100 },
    { id: "dateTime", label: "Date & Time", minWidth: 200, sortable: true },
    { id: "ipAddress", label: "IP Address", minWidth: 160 },
    { id: "deviceInfo", label: "Device Info", minWidth: 200 },
  ];
export const userLoginSecurityTempData: UserLoginSecurityEvent[] = [
  {
    logId: "001",
    userId: "001",
    eventType: "Login",
    outcome: "Success",
    dateTime: "2025-05-01 11:00 AM UTC",
    ipAddress: "131.241.13.245",
    deviceInfo: "iPhone 14 Pro Max (iOS 19.1)",
  },
  {
    logId: "002",
    userId: "002",
    eventType: "Create Account",
    outcome: "Failure",
    dateTime: "2025-05-01 11:00 AM UTC",
    ipAddress: "88.123.13.145",
    deviceInfo: "iPhone 14 Pro Max (iOS 19.1)",
  },
];
export function createUserLoginSecurityData(
  logId: string,
  userId: string,
  eventType: string,
  outcome: string,
  dateTime: string,
  ipAddress: string,
  deviceInfo: string
): UserLoginSecurityEvent {
  return { logId, userId, eventType, outcome, dateTime, ipAddress, deviceInfo };
}

// Administrative Actions Log
export type AdministrativeActionLog = {
  logId: string;
  adminId: string;
  userId: string;
  actionType: string;
  reason: string;
  dateTime: string;
  ipAddress: string;
};
export const administrativeActionsColumns: readonly Column<AdministrativeActionLog>[] =
  [
    { id: "logId", label: "Log ID", minWidth: 80,  },
    { id: "adminId", label: "Admin ID", minWidth: 120 },
    { id: "userId", label: "User ID", minWidth: 120 },
    { id: "actionType", label: "Action Type", minWidth: 150 },
    { id: "reason", label: "Reason", minWidth: 250 },
    { id: "dateTime", label: "Date & Time", minWidth: 200, sortable: true },
    { id: "ipAddress", label: "IP Address", minWidth: 160 },
  ];
export const administrativeActionsTempData: AdministrativeActionLog[] = [
  {
    logId: "001",
    adminId: "001",
    userId: "001",
    actionType: "Account Deletion",
    reason: "User requested deletion via support ticket",
    dateTime: "2025-05-01 11:00 AM UTC",
    ipAddress: "131.241.13.245",
  },
  {
    logId: "002",
    adminId: "002",
    userId: "002",
    actionType: "Account Blocked",
    reason: "User requested deletion via support ticket",
    dateTime: "2025-05-01 11:00 AM UTC",
    ipAddress: "88.123.13.145",
  },
];
export function createAdministrativeActionData(
  logId: string,
  adminId: string,
  userId: string,
  actionType: string,
  reason: string,
  dateTime: string,
  ipAddress: string
): AdministrativeActionLog {
  return { logId, adminId, userId, actionType, reason, dateTime, ipAddress };
}

// Data Deletion Log
export type DataDeletionLog = {
  logId: string;
  userId: string;
  requestedBy: string;
  reason: string;
  dateTime: string;
  ipAddress: string;
};
export const dataDeletionColumns: readonly Column<DataDeletionLog>[] = [
  { id: "logId", label: "Log ID", minWidth: 80 },
  { id: "userId", label: "User ID", minWidth: 80 },
  { id: "requestedBy", label: "Requested By", minWidth: 150 },
  { id: "reason", label: "Reason", minWidth: 200 },
  { id: "dateTime", label: "Date & Time", minWidth: 200, sortable: true },
  { id: "ipAddress", label: "IP Address", minWidth: 160 },
];
export const dataDeletionTempData: DataDeletionLog[] = [
  {
    logId: "001",
    userId: "001",
    requestedBy: "User (Self)",
    reason: "User requested",
    dateTime: "2025-05-01 11:00 AM UTC",
    ipAddress: "131.241.13.245",
  },
  {
    logId: "002",
    userId: "002",
    requestedBy: "Admin",
    reason: "Account Inactive",
    dateTime: "2025-05-01 11:00 AM UTC",
    ipAddress: "88.123.13.145",
  },
];
export function createDataDeletionLogData(
  logId: string,
  userId: string,
  requestedBy: string,
  reason: string,
  dateTime: string,
  ipAddress: string
): DataDeletionLog {
  return { logId, userId, requestedBy, reason, dateTime, ipAddress };
}

//Content - Moderation

// Vetting Log
interface VettingLog {
  id: string;
  title: string;
  sources: number;
  vettingStatus: JSX.Element;
  confidenceScore?: string;
  dateTime: string;
}

// API Response types for Vetting Logs
export interface VettingLogApiResponse {
  ctxId: string;
  statusCode: number;
  message: string;
  timestamp: string;
  data: {
    logs: VettingLogApiData[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface VettingLogApiData {
  id: string;
  videoTitle: string;
  confidenceScore?: number;
  processingStatus: string;
  sourcesCount: number;
  createdAt: string;
  source: string;
}
export const vettingLogsColumns: readonly Column<VettingLog>[] = [
  { id: "id", label: "ID", minWidth: 80 },
  { id: "title", label: "Title", minWidth: 250 },
  { id: "sources", label: "Sources", minWidth: 100 },
  { id: "vettingStatus", label: "Vetting Status", minWidth: 150 },
  { id: "confidenceScore", label: "Confidence Score", minWidth: 200 },
  { id: "dateTime", label: "Date & Time", minWidth: 200, sortable: true },
];
export const vettingLogsTempData = [
  {
    id: "001",
    title: "AI & your health: Smarter Insights for better living",
    sources: 2,
    vettingStatus: "completed",
    confidenceScore: "98%",
    dateTime: "2025-05-01 11:00 AM UTC",
  },
  {
    id: "002",
    title: "Exploring the impact of stress on physical health",
    sources: 3,
    vettingStatus: "in-progress",
    confidenceScore: "75%",
    dateTime: "2025-05-02 09:30 AM UTC",
  },
  {
    id: "003",
    title: "Understanding nutrition myths and facts",
    sources: 1,
    vettingStatus: "failed",
    confidenceScore: "42%",
    dateTime: "2025-05-03 02:15 PM UTC",
  },
  {
    id: "004",
    title: "Holistic approaches to mental wellness",
    sources: 4,
    vettingStatus: "pending",
    confidenceScore: undefined,
    dateTime: "2025-05-04 04:45 PM UTC",
  },
  {
    id: "005",
    title: "The role of genetics in personalized healthcare",
    sources: 5,
    vettingStatus: "completed",
    confidenceScore: "94%",
    dateTime: "2025-05-05 10:00 AM UTC",
  },
];
export function createVettingLogData(
  id: string,
  title: string,
  sources: number,
  vettingStatus: JSX.Element,
  confidenceScore: string | undefined,
  dateTime: string
): VettingLog {
  return { id, title, sources, vettingStatus, confidenceScore, dateTime };
}
// User Cohort Data
export type UserCohortData = {
  id: string;
  name: string;
  date: string;
  action: JSX.Element;
};
export const UserCohortColumns: readonly Column<UserCohortData>[] = [
  { id: "id", label: "Cohort ID", minWidth: 100, sortable: false },
  { id: "name", label: "Cohort Name", minWidth: 100, sortable: false },
  { id: "date", label: "Created Date & Time", minWidth: 150, sortable: false },
  { id: "action", label: "", minWidth: 50, sortable: false },
];
export const UserCohortTempData = [
  {
    id: "1",
    name: "John Doe",
    date: "2025-05-01 11:00 AM UTC",
  },
  {
    id: "2",
    name: "John Doe",
    date: "2025-05-01 11:00 AM UTC",
  },
  {
    id: "3",
    name: "John Doe",
    date: "2025-05-01 11:00 AM UTC",
  },
  {
    id: "4",
    name: "John Doe",
    date: "2025-05-01 11:00 AM UTC",
  },
  {
    id: "5",
    name: "John Doe",
    date: "2025-05-01 11:00 AM UTC",
  },
];
export function createUserCohortData(
  id: string,
  name: string,
  date: string,
  action: JSX.Element
): UserCohortData {
  return {
    id,
    name,
    date,
    action,
  };
}

// Flagged Content Report

export interface FlaggedContentReport {
  id: string;
  title: string;
  category: string;
  publishStatus: JSX.Element;
  flagReports: number;
  reportStatus: JSX.Element;
  action: JSX.Element;
}
export const flaggedContentColumns: readonly Column<FlaggedContentReport>[] = [
  { id: "id", label: "ID", minWidth: 80 },
  { id: "title", label: "Title", minWidth: 250 },
  { id: "category", label: "Category", minWidth: 180 },
  { id: "publishStatus", label: "Publish Status", minWidth: 150 },
  { id: "flagReports", label: "Flag Reports", minWidth: 150 },
  { id: "reportStatus", label: "Report Status", minWidth: 150 },
  { id: "action", label: "", minWidth: 100 },
];
export const flaggedContentRawData = [
  {
    id: "001",
    title: "AI & your health: Smarter Insights for better living",
    category: "Fitness & Lifestyle",
    publishStatus: "active",
    flagReports: 1,
    reportStatus: "new",
  },
  {
    id: "002",
    title: "Exploring stress and its effects",
    category: "Wellness",
    publishStatus: "hidden",
    flagReports: 1,
    reportStatus: "resolved",
  },
  {
    id: "003",
    title: "Benefits of regular exercise",
    category: "Fitness & Lifestyle",
    publishStatus: "active",
    flagReports: 2,
    reportStatus: "new",
  },
  {
    id: "004",
    title: "Managing hypertension effectively",
    category: "Hypertension",
    publishStatus: "deleted",
    flagReports: 5,
    reportStatus: "new",
  },
  {
    id: "005",
    title: "Common misconceptions in fitness",
    category: "Lorem Ipsum",
    publishStatus: "active",
    flagReports: 3,
    reportStatus: "new",
  },
  {
    id: "006",
    title: "Holistic wellness approaches",
    category: "Wellness",
    publishStatus: "hidden",
    flagReports: 2,
    reportStatus: "new",
  },
  {
    id: "007",
    title: "Genetic testing and fitness plans",
    category: "Hypertension",
    publishStatus: "active",
    flagReports: 4,
    reportStatus: "resolved",
  },
  {
    id: "008",
    title: "AI in fitness and lifestyle",
    category: "Fitness & Lifestyle",
    publishStatus: "deleted",
    flagReports: 2,
    reportStatus: "new",
  },
  {
    id: "009",
    title: "Nutrition tracking tools",
    category: "Lorem Ipsum",
    publishStatus: "active",
    flagReports: 1,
    reportStatus: "resolved",
  },
  {
    id: "010",
    title: "Mindfulness for stress relief",
    category: "Wellness",
    publishStatus: "hidden",
    flagReports: 1,
    reportStatus: "new",
  },
];
export function createFlaggedContentData(
  id: string,
  title: string,
  category: string,
  publishStatus: JSX.Element,
  flagReports: number,
  reportStatus: JSX.Element,
  action: JSX.Element
): FlaggedContentReport {
  return {
    id,
    title,
    category,
    publishStatus,
    flagReports,
    reportStatus,
    action,
  };
}

// Content Library
export type ContentLibraryData = {
  _id: string;
  title: string;
  confidenceScore: string;
  categoryId: string;
  status: JSX.Element;
  action: JSX.Element;
};
export const ContentLibraryColumns: readonly Column<ContentLibraryData>[] = [
  { id: "_id", label: "ID", minWidth: 100, sortable: false },
  { id: "title", label: "Title", minWidth: 200, sortable: true },
  {
    id: "confidenceScore",
    label: "Confidence Score",
    minWidth: 150,
    sortable: true,
  },
  {
    id: "categoryId",
    label: "Category",
    minWidth: 150,
    sortable: false,
  },
  {
    id: "status",
    label: "Publish Status",
    minWidth: 150,
    sortable: false,
  },
  { id: "action", label: "", minWidth: 50, sortable: false },
];
export function createContentLibraryData(
  _id: string,
  title: string,
  confidenceScore: string,
  categoryId: string,
  status: JSX.Element,
  action: JSX.Element
): ContentLibraryData {
  return {
    _id,
    title,
    confidenceScore,
    categoryId,
    status,
    action,
  };
}

export type ContentCategoryData = {
  id: string;
  title: string;
  createdBy: string;
  noOfSubcategories: string;
  noOfDisease: string;
  action?: JSX.Element;
};
export const ContentCategoryColumns: readonly Column<ContentCategoryData>[] = [
  { id: "id", label: "ID", minWidth: 100, sortable: false },
  { id: "title", label: "Title", minWidth: 100, sortable: false },
  {
    id: "createdBy",
    label: "Created By",
    minWidth: 150,
    sortable: false,
  },
  {
    id: "noOfSubcategories",
    label: "No of subcategories",
    minWidth: 150,
    sortable: false,
  },
  {
    id: "noOfDisease",
    label: "No of disease",
    minWidth: 150,
    sortable: false,
  },
 
];


export const ContentCategoryTempData = [
  {
    id: "1",
    title: "Category Name 1",
    createdBy: "Fabric Agent",
    noOfSubcategories: "5",
    noOfDisease: "12",
  },
  {
    id: "2",
    title: "Category Name 2",
    createdBy: "Admin",
    noOfSubcategories: "3",
    noOfDisease: "8",
  },
  {
    id: "3",
    title: "Category Name 3",
    createdBy: "Admin",
    noOfSubcategories: "7",
    noOfDisease: "15",
  },
  {
    id: "4",
    title: "Category Name 4",
    createdBy: "Fabric Agent",
    noOfSubcategories: "2",
    noOfDisease: "6",
  },
  {
    id: "5",
    title: "Category Name 5",
    createdBy: "Fabric Agent",
    noOfSubcategories: "9",
    noOfDisease: "20",
  },
];
export function createContentCategoryData(
  id: string,
  title: string,
  createdBy: string,
  noOfSubcategories: string,
  noOfDisease: string,
  action?: JSX.Element
): ContentCategoryData {
  return {
    id,
    title,
    createdBy,
    noOfSubcategories,
    noOfDisease,
    action,
  };
}

export type ContentSubCategoryData = {
  id: string;
  title: string;
  diseases: string;
  action: JSX.Element;

};

export const ContentSubCategoryColumns: readonly Column<ContentSubCategoryData>[] = [
  { id: "id", label: "ID", minWidth: 100, sortable: false },
  { id: "title", label: "Sub Category Title", minWidth: 200, sortable: false },
  { id: "diseases", label: "Diseases", minWidth: 200, sortable: false },
  { id: "action", label: "", minWidth: 50, sortable: false },

];

export function createContentSubCategoryData(
  id: string,
  title: string,
  diseases: string,
  action: JSX.Element
  
): ContentSubCategoryData {
  return {
    id,
    title,
    diseases,
    action
  };
}
export type ContentTagData = {
  id: string;
  title: string;
  generatedBy: string;
  category: string;
  usedInContent: string;
};
export const ContentTagColumns: readonly Column<ContentTagData>[] = [
  { id: "id", label: "ID", minWidth: 100, sortable: false },
  { id: "title", label: "Title", minWidth: 100, sortable: false },
  { id: "generatedBy", label: "Generated by", minWidth: 100, sortable: false },
  { id: "category", label: "Category", minWidth: 100, sortable: false },
  {
    id: "usedInContent",
    label: "Used in Content",
    minWidth: 100,
    sortable: false,
  },
];
export const ContentTagTempData = [
  {
    id: "1",
    title: "Tag Name 1",
    generatedBy: "Fabric Agent",
    Category: "Fitness & Lifestyle",
    usedInContent: "11200",
  },
  {
    id: "2",
    title: "Tag Name 1",
    generatedBy: "Fabric Agent",
    Category: "Fitness & Lifestyle",
    usedInContent: "11200",
  },
  {
    id: "3",
    title: "Tag Name 1",
    generatedBy: "Fabric Agent",
    Category: "Fitness & Lifestyle",
    usedInContent: "11200",
  },
  {
    id: "4",
    title: "Tag Name 1",
    generatedBy: "Fabric Agent",
    Category: "Fitness & Lifestyle",
    usedInContent: "11200",
  },
  {
    id: "5",
    title: "Tag Name 1",
    generatedBy: "Fabric Agent",
    Category: "Fitness & Lifestyle",
    usedInContent: "11200",
  },
];
export function createContentTagData(
  id: string,
  title: string,
  generatedBy: string,
  category: string,
  usedInContent: string
): ContentTagData {
  return {
    id,
    title,
    generatedBy,
    category,
    usedInContent,
  };
}

export type ScrapperLogData = {
  id: string;
  contentScrapped: string;
  filterVetting: string;
  rejectVetting: string;
  date: string;
};
export const ScrapperLogColumns: readonly Column<ScrapperLogData>[] = [
  { id: "id", label: "Request ID", minWidth: 100, sortable: false },
  {
    id: "contentScrapped",
    label: "#Content Scrapped",
    minWidth: 100,
    sortable: false,
  },
  {
    id: "filterVetting",
    label: "#Filtered for Vetting",
    minWidth: 100,
    sortable: false,
  },
  {
    id: "rejectVetting",
    label: "#Rejected for Vetting",
    minWidth: 100,
    sortable: false,
  },
  {
    id: "date",
    label: "Date & Time",
    minWidth: 100,
    sortable: false,
  },
];
export const ScrapperLogTempData = [
  {
    id: "1",
    contentScrapped: "12000",
    filterVetting: "11000",
    rejectVetting: "1000",
    date: "2025-05-01 11:00 AM UTC",
  },
  {
    id: "2",
    contentScrapped: "12000",
    filterVetting: "11000",
    rejectVetting: "1000",
    date: "2025-05-01 11:00 AM UTC",
  },
  {
    id: "3",
    contentScrapped: "12000",
    filterVetting: "11000",
    rejectVetting: "1000",
    date: "2025-05-01 11:00 AM UTC",
  },
  {
    id: "4",
    contentScrapped: "12000",
    filterVetting: "11000",
    rejectVetting: "1000",
    date: "2025-05-01 11:00 AM UTC",
  },
  {
    id: "5",
    contentScrapped: "12000",
    filterVetting: "11000",
    rejectVetting: "1000",
    date: "2025-05-01 11:00 AM UTC",
  },
];
export function createScrapperLogData(
  id: string,
  contentScrapped: string,
  filterVetting: string,
  rejectVetting: string,
  date: string
): ScrapperLogData {
  return {
    id,
    contentScrapped,
    filterVetting,
    rejectVetting,
    date,
  };
}

export type ScrapperLogDetailData = {
  id: string;
  title: string;
  source: string;
  status: JSX.Element;
  rejectionReason: string;
};
export const ScrapperLogDetailColumns: readonly Column<ScrapperLogDetailData>[] = [
  { id: "title", label: "Title", minWidth: 100, sortable: false },
  {
    id: "source",
    label: "Source",
    minWidth: 100,
    sortable: false,
  },
  {
    id: "status",
    label: "Vetting selection status",
    minWidth: 100,
    sortable: false,
  },
  {
    id: "rejectionReason",
    label: "Rejection Reason",
    minWidth: 100,
    sortable: false,
  },
];
export const ScrapperLogDetailTempData = [
  {
    id: "1",
    title: "AI & your health: Smarter Insights for better living",
    source: "YouTube",
    status: "rejected",
    rejectionReason: "Lorem ipsum dolor sit amet,consectetur adipiscing elit.",
  },
  {
    id: "2",
    title: "AI & your health: Smarter Insights for better living",
    source: "YouTube",
    status: "active",
    rejectionReason: "",
  },
  {
    id: "3",
    title: "AI & your health: Smarter Insights for better living",
    source: "YouTube",
    status: "rejected",
    rejectionReason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: "4",
    title: "AI & your health: Smarter Insights for better living",
    source: "YouTube",
    status: "active",
    rejectionReason: "",
  },
  {
    id: "5",
    title: "AI & your health: Smarter Insights for better living",
    source: "YouTube",
    status: "rejected",
    rejectionReason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];
export function createScrapperLogDetailData(
  id: string,
  title: string,
  source: string,
  status: JSX.Element,
  rejectionReason: string
): ScrapperLogDetailData {
  return {
    id,
    title,
    source,
    status,
    rejectionReason,
  };
}
export type LegalDocsData = {
  docName:JSX.Element;
  updatedAt:string;
};
export const LegalDocsColumns: readonly Column<LegalDocsData>[] = [
  { id: "docName", label: "Document Name", minWidth: 100, sortable: false },
  { id: "updatedAt", label: "Last Updated At", minWidth: 100, sortable: false },
]
export function createLegalDocsData(
  docName:JSX.Element,
  updatedAt:string
): LegalDocsData {
  return {
    docName,
    updatedAt
  };
}
export type NotificationData = {
  id:string;
  title:string;
  type:string;
  createAt:string;
  scheduleAt:String;
  status:JSX.Element;
  action:JSX.Element;
};
export const NotificationColumns: readonly Column<NotificationData>[] = [
  { id: "title", label: "Title", minWidth: 100, sortable: false },
  { id: "type", label: "Type", minWidth: 100, sortable: false },
  { id: "createAt", label: "Create Date & Time", minWidth: 170, sortable: true },
  { id: "scheduleAt", label: "Schedule Date & Time", minWidth: 170, sortable: false },
  { id: "status", label: "Status", minWidth: 100, sortable: false },
  { id: "action", label: "", minWidth: 100, sortable: false },
]
export function createNotificationData(
  id:string,
  title:string,
  type:string,
  createAt:string,
  scheduleAt:string,
  status:JSX.Element,
  action:JSX.Element
): NotificationData {
  return {
    id,
    title,
    type,
    createAt,
    scheduleAt,
    status,
    action
  };
}

export type UserRoleData = {
  id:string;
  name:string;
  module:string;
  users:string;
  action:JSX.Element;
};
export const UserRoleColumns: readonly Column<UserRoleData>[] = [
  { id: "id", label: "RoleID", minWidth: 100, sortable: false },
  { id: "name", label: "Name", minWidth: 100, sortable: false },
  { id: "module", label: "Accessible Modules", minWidth: 170, sortable: false },
  { id: "users", label: "Associated Users", minWidth: 170, sortable: true },
  { id: "action", label: "", minWidth: 100, sortable: false },
]
export function createUserRoleData(
  id:string,
  name:string,
  module:string,
  users:string,
  action:JSX.Element
): UserRoleData {
  return {
    id,
    name,
    module,
    users,
    action
  };
}

export type AdminUserData = {
  _id:string;
  name:string;
  email:string;
  role:string;
  createdAt:string;
  status:JSX.Element;
  action:JSX.Element;
};
export const AdminUserColumns: readonly Column<AdminUserData>[] = [
  { id: "_id", label: "User ID", minWidth: 100, sortable: false },
  { id: "name", label: "Name", minWidth: 100, sortable: false },
  { id: "email", label: "Email Address", minWidth: 170, sortable: false },
  { id: "role", label: "Role", minWidth: 170, sortable: false },
  { id: "createdAt", label: "Created At", minWidth: 170, sortable: true },
  { id: "status", label: "Status", minWidth: 170, sortable: false },
  { id: "action", label: "", minWidth: 100, sortable: false },
]
export function createAdminUserData(
  _id:string,
  name:string,
  email:string,
  role:string,
  createdAt:string,
  status:JSX.Element,
  action:JSX.Element
): AdminUserData {
  return {
    _id,
    name,
    email,
    role,
    createdAt,
    status,
    action
  };
}

export type SupportTicketData = {
  id:string;
  reason:string;
  raisedBy:string;
  raisedAt:string;
  resolvedAt:string;
  resolutionTime:string;
  lastRespond:string;
  status:JSX.Element;
};

// Blocked Keywords Types
export interface BlockedKeyword {
  _id: string;
  keyword: string;
  __v: number;
  createdAt: string;
  createdBy: string;
  fullName: string;
  isActive: boolean;
  updatedAt: string;
}

export interface BlockedKeywordsResponse {
  blockedKeywords: BlockedKeyword[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
export const SupportTicketColumns: readonly Column<SupportTicketData>[] = [
  { id: "id", label: "Ticket ID", minWidth: 100, sortable: false },
  { id: "reason", label: "Reason", minWidth: 100, sortable: false },
  { id: "raisedBy", label: "Raised By(User ID)", minWidth: 170, sortable: false },
  { id: "raisedAt", label: "Raised At", minWidth: 170, sortable: false },
  { id: "resolvedAt", label: "Resolved At", minWidth: 170, sortable: false },
  { id: "resolutionTime", label: "Resolution Time", minWidth: 170, sortable: false },
  { id: "lastRespond", label: "Last Respond", minWidth: 170, sortable: false },
  { id: "status", label: "Role", minWidth: 170, sortable: false },
]
export function createSupportTicketData(
  id:string,
  reason:string,
  raisedBy:string,
  raisedAt:string,
  resolvedAt:string,
  resolutionTime:string,
  lastRespond:string,
  status:JSX.Element,
): SupportTicketData {
  return {
    id,
    reason,
    raisedBy,
    raisedAt,
    resolvedAt,
    resolutionTime,
    lastRespond,
    status,
  };
}