import React, { type JSX } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  IconButton,
  MenuItem,
} from "@mui/material";
import { DeleteOutline, Edit } from "@mui/icons-material";
import { StyledTextField } from "../../../utils/helper";

interface CustomQuestionsPageProps {
  onBack: () => void;
  onCancel: () => void;
  onSubmit: (data: CustomQuestionData[]) => void;
  initialQuestions?: CustomQuestionData[] | null;
}

export interface CustomQuestionData {
  question: string;
  answerType: string;
  options?: string[];
}

const answerTypeOptions = [
  { value: "short_text", label: "Short Text" },
  { value: "long_text", label: "Long Text" },
  { value: "single_choice", label: "Single choice (dropdown)" },
  { value: "multiselect", label: "Multichoice" },
  { value: "date", label: "Date" },
  { value: "time", label: "Time" },
];

export default function CustomQuestionsPage({
  onBack: _onBack,
  onCancel,
  onSubmit,
  initialQuestions,
}: CustomQuestionsPageProps): JSX.Element {
  const [question, setQuestion] = React.useState("");
  const [answerType, setAnswerType] = React.useState("");
  const [options, setOptions] = React.useState<string[]>(["", ""]);
  const [createdQuestions, setCreatedQuestions] = React.useState<CustomQuestionData[]>(initialQuestions || []);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);

  // Update state when initialQuestions changes
  React.useEffect(() => {
    if (initialQuestions) {
      setCreatedQuestions(initialQuestions);
    }
  }, [initialQuestions]);

  const showOptions = answerType === "single_choice" || answerType === "multiselect";

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 1) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleEditQuestion = (index: number) => {
    const questionToEdit = createdQuestions[index];
    setQuestion(questionToEdit.question);
    setAnswerType(questionToEdit.answerType);
    
    // Set options if they exist, otherwise set default empty options
    if (questionToEdit.options && questionToEdit.options.length > 0) {
      setOptions([...questionToEdit.options, ""]); // Add one empty option for adding more
    } else {
      setOptions(["", ""]);
    }
    
    setEditingIndex(index);
    // Remove the question from the list (will be re-added when user clicks "Add Questions")
    const newQuestions = createdQuestions.filter((_, i) => i !== index);
    setCreatedQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    if (!question.trim() || !answerType) return;

    const questionData: CustomQuestionData = {
      question: question.trim(),
      answerType,
      options: showOptions ? options.filter((opt) => opt.trim() !== "") : undefined,
    };

    if (editingIndex !== null) {
      // If editing, insert at the original position
      const newQuestions = [...createdQuestions];
      newQuestions.splice(editingIndex, 0, questionData);
      setCreatedQuestions(newQuestions);
      setEditingIndex(null);
    } else {
      // If adding new, append to the end
      setCreatedQuestions([...createdQuestions, questionData]);
    }
    
    setQuestion("");
    setAnswerType("");
    setOptions(["", ""]);
  };

  const handleCreateQuestion = () => {
    if (createdQuestions.length === 0 && (!question.trim() || !answerType)) {
      return;
    }

    // If there's a current question being filled, add it first
    if (question.trim() && answerType) {
      const questionData: CustomQuestionData = {
        question: question.trim(),
        answerType,
        options: showOptions ? options.filter((opt) => opt.trim() !== "") : undefined,
      };
      onSubmit([...createdQuestions, questionData]);
    } else {
      onSubmit(createdQuestions);
    }
  };

  // Reset options when answer type changes
  React.useEffect(() => {
    if (showOptions) {
      if (options.length < 2) {
        setOptions(["", ""]);
      }
    } else {
      setOptions([]);
    }
  }, [answerType]);

  return (
    <Stack
      sx={{
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        width: "100%",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{ width: "100%" }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Icon */}
          <Box
            component="img"
            src="/assets/icons/service_offered_icons/custom_form_flow.svg"
            alt="Custom Form"
            sx={{
              width: "48px",
              height: "48px",
              objectFit: "contain",
            }}
          />
        </Stack>
      </Stack>

      {/* Form Fields */}
      <Stack sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Title */}
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontSize: "28px",
              fontWeight: 600,
              color: "#111927",
            }}
          >
            Custom Questions
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              color: "#6C737F",
              mt: 1,
            }}
          >
            Create Questions that will be asked to all clients during service booking.
          </Typography>
        </Box>

        {/* Question */}
        <Box>
          <StyledTextField
            fullWidth
            variant="outlined"
            label="Question"
            placeholder="e.g. What is the event location"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            sx={{ mt: 2 }}
          />
        </Box>

        {/* Answer Type */}
        <Box>
          <StyledTextField
            fullWidth
            variant="outlined"
            label="Answer Type"
            value={answerType}
            onChange={(e) => setAnswerType(e.target.value as string)}
            select
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => {
                if (!selected) {
                  return "";
                }
                const selectedOption = answerTypeOptions.find(
                  (o) => o.value === selected
                );
                return selectedOption ? selectedOption.label : "";
              },
              MenuProps: {
                disablePortal: false,
                PaperProps: {
                  style: {
                    maxHeight: 250,
                    overflowY: "auto",
                    borderRadius: "8px",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  },
                  sx: {
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                  },
                },
                sx: {
                  zIndex: 3000,
                  "& .MuiPaper-root": {
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  },
                },
              },
            }}
          >
            <MenuItem value="" sx={{ fontSize: "16px", color: "#6C737F" }}>
              Select
            </MenuItem>
            {answerTypeOptions.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{ fontSize: "16px", color: "#111927" }}
              >
                {option.label}
              </MenuItem>
            ))}
          </StyledTextField>
        </Box>

        {/* Options Section (shown when Single choice or Multiselect is selected) */}
        {showOptions && (
          <Box>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#111927",
                marginBottom: "8px",
              }}
            >
              Options
            </Typography>
            <Stack spacing={2}>
              {options.map((option, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <StyledTextField
                    fullWidth
                    variant="outlined"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                  {options.length > 1 && (
                    <IconButton
                      onClick={() => handleRemoveOption(index)}
                      sx={{
                        color: "#F04438",
                        padding: "8px",
                        "&:hover": {
                          backgroundColor: "#FEE4E2",
                        },
                      }}
                    >
                      <DeleteOutline sx={{ fontSize: "20px" }} />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Stack>
            <Button
              startIcon={
                <Box
                  component="img"
                  src="/assets/icons/add.svg"
                  alt="add"
                  sx={{ width: "18px", height: "18px" }}
                />
              }
              onClick={handleAddOption}
              sx={{
                color: "#111927",
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 500,
                mt: 2,
                alignSelf: "flex-start",
                padding: "4px 8px",
                minWidth: "auto",
                "&:hover": {
                  backgroundColor: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              Add Options
            </Button>
          </Box>
        )}

        {/* Add Question Button */}
        <Button
          startIcon={
            <Box
              component="img"
              src="/assets/icons/add.svg"
              alt="add"
              sx={{ width: "20px", height: "20px" }}
            />
          }
          onClick={handleAddQuestion}
          disabled={!question.trim() || !answerType || (showOptions && options.filter((opt) => opt.trim() !== "").length < 2)}
          sx={{
            backgroundColor: "#E3F0F8",
            color: "#111927",
            textTransform: "none",
            fontSize: "16px",
            fontWeight: 500,
            alignSelf: "flex-start",
            padding: "12px 24px",
            borderRadius: "100px",
            "&:hover": {
              backgroundColor: "#D2E7F5",
            },
            "&:disabled": {
              backgroundColor: "#F3F4F6",
              color: "#9DA4AE",
            },
          }}
        >
          {editingIndex !== null ? "Update Question" : "Add Questions"}
        </Button>

        {/* Added Questions List */}
        {createdQuestions.length > 0 && (
          <Box
            sx={{
              mt: 3,
              pt: 3,
              borderTop: "1px solid #E5E7EB",
            }}
          >
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#111927",
                mb: 2,
              }}
            >
              Added Questions ({createdQuestions.length})
            </Typography>
            <Stack spacing={2}>
              {createdQuestions.map((q, index) => {
                const answerTypeLabel = answerTypeOptions.find(
                  (opt) => opt.value === q.answerType
                )?.label || q.answerType;
                return (
                  <Box
                    key={index}
                    sx={{
                      backgroundColor: "#F9FAFB",
                      borderRadius: "8px",
                      padding: "16px",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#111927",
                            mb: 1,
                          }}
                        >
                          {q.question}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            fontWeight: 400,
                            color: "#6C737F",
                            mb: q.options && q.options.length > 0 ? 1 : 0,
                          }}
                        >
                          Answer Type: {answerTypeLabel}
                        </Typography>
                        {q.options && q.options.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <Typography
                              sx={{
                                fontSize: "12px",
                                fontWeight: 500,
                                color: "#6C737F",
                                mb: 0.5,
                              }}
                            >
                              Options:
                            </Typography>
                            <Stack direction="row" flexWrap="wrap" gap={0.5}>
                              {q.options.map((opt, optIndex) => (
                                <Box
                                  key={optIndex}
                                  sx={{
                                    backgroundColor: "#FFFFFF",
                                    border: "1px solid #E5E7EB",
                                    borderRadius: "4px",
                                    padding: "4px 8px",
                                    fontSize: "12px",
                                    color: "#111927",
                                  }}
                                >
                                  {opt}
                                </Box>
                              ))}
                            </Stack>
                          </Box>
                        )}
                      </Box>
                      <Stack direction="row" spacing={0.5}>
                        <IconButton
                          onClick={() => handleEditQuestion(index)}
                          sx={{
                            color: "#0D4FAB",
                            padding: "4px",
                            "&:hover": {
                              backgroundColor: "#E3F0F8",
                            },
                          }}
                        >
                          <Edit sx={{ fontSize: "18px" }} />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            const newQuestions = createdQuestions.filter((_, i) => i !== index);
                            setCreatedQuestions(newQuestions);
                          }}
                          sx={{
                            color: "#F04438",
                            padding: "4px",
                            "&:hover": {
                              backgroundColor: "#FEE4E2",
                            },
                          }}
                        >
                          <DeleteOutline sx={{ fontSize: "18px" }} />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        )}
      </Stack>

      {/* Action Buttons */}
      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={2}
        sx={{ mt: 2 }}
      >
        <Button
          onClick={onCancel}
          sx={{
            backgroundColor: "#FFFFFF",
            color: "#111927",
            textTransform: "none",
            fontSize: "16px",
            fontWeight: 500,
            padding: "12px 24px",
            borderRadius: "100px",
            border: "1px solid #E5E7EB",
            "&:hover": {
              backgroundColor: "#F9FAFB",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreateQuestion}
          disabled={createdQuestions.length === 0 && (!question.trim() || !answerType)}
          sx={{
            backgroundColor: "#111927",
            color: "#FFFFFF",
            textTransform: "none",
            fontSize: "16px",
            fontWeight: 500,
            padding: "12px 24px",
            borderRadius: "100px",
            "&:hover": {
              backgroundColor: "#1F2937",
            },
            "&:disabled": {
              backgroundColor: "#D1D5DB",
              color: "#9CA3AF",
            },
          }}
        >
          Create Question
        </Button>
      </Stack>
    </Stack>
  );
}


