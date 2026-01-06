import React, { type JSX } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  IconButton,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { Close, DeleteOutline, Add } from "@mui/icons-material";
import DropdownArrow from "/assets/icons/dropdown-arrow-black.svg";
import { styled } from "@mui/material/styles";

const DropdownArrowIcon = () => (
  <img src={DropdownArrow} alt="open select menu" style={{ marginRight: 8 }} />
);

const DialogTextField = styled(TextField)(() => ({
  "& .MuiInputBase-root": {
    backgroundColor: "#FFFFFF",
    color: "#111927",
    borderRadius: "8px",
    fontSize: "16px",
  },
  "& .MuiInputBase-input": {
    padding: "12px 16px",
  },
  "& .MuiInputLabel-root": {
    display: "block",
    position: "static",
    transform: "none",
    fontSize: "14px",
    fontWeight: 500,
    color: "#111927",
    marginBottom: "8px",
  },
  "& .MuiOutlinedInput-root": {
    "& .MuiOutlinedInput-notchedOutline": {
      border: `1px solid #E5E7EB`,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: `1px solid #E5E7EB`,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: `1px solid #E5E7EB`,
    },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#9DA4AE",
  },
}));

const DialogSelect = styled(Select)(() => ({
  borderRadius: "8px",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#E5E7EB",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#E5E7EB",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#E5E7EB",
  },
  "& .MuiSelect-select": {
    fontSize: "16px",
    fontWeight: 400,
    color: "#111927",
    padding: "12px 16px",
  },
}));

interface CustomQuestionsDialogProps {
  handleClose: () => void;
  onCreateQuestion: (data: CustomQuestionData[]) => void;
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

export default function CustomQuestionsDialog({
  handleClose,
  onCreateQuestion,
}: CustomQuestionsDialogProps): JSX.Element {
  const [question, setQuestion] = React.useState("");
  const [answerType, setAnswerType] = React.useState("");
  const [options, setOptions] = React.useState<string[]>(["", ""]);
  const [createdQuestions, setCreatedQuestions] = React.useState<CustomQuestionData[]>([]);

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

  const handleAddQuestion = () => {
    if (!question.trim() || !answerType) {
      return; // Don't add if question or answer type is empty
    }

    // Validate options for single choice and multiselect
    if (showOptions) {
      const validOptions = options.filter((opt) => opt.trim() !== "");
      if (validOptions.length < 2) {
        return; // Need at least 2 options
      }
    }

    const questionData: CustomQuestionData = {
      question,
      answerType,
      ...(showOptions && { options: options.filter((opt) => opt.trim() !== "") }),
    };

    // Add to created questions list
    setCreatedQuestions([...createdQuestions, questionData]);

    // Reset form for next question
    setQuestion("");
    setAnswerType("");
    setOptions(["", ""]);
  };

  const handleCreateQuestion = () => {
    // If there's a current question being filled, add it first
    if (question.trim() && answerType) {
      handleAddQuestion();
    }

    // Submit all created questions
    if (createdQuestions.length > 0) {
      onCreateQuestion(createdQuestions);
      handleClose();
    }
  };

  // Reset options when answer type changes
  React.useEffect(() => {
    if (answerType === "single_choice" || answerType === "multiselect") {
      if (options.length < 2) {
        setOptions(["", ""]);
      }
    } else {
      setOptions([]);
    }
  }, [answerType]);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
      }}
    >
      {/* Green vertical bar on the left */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "4px",
          backgroundColor: "#12B76A",
          borderRadius: "0 4px 4px 0",
        }}
      />

      <Stack
        sx={{
          padding: "40px",
          paddingLeft: "44px", // Account for green bar
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
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={2}
          sx={{ width: "100%" }}
        >
          <Stack direction="row" alignItems="flex-start" spacing={2}>
            {/* Icon */}
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "8px",
                backgroundColor: "#D1FAE5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {/* Document icon - using a simple document representation */}
              <Box
                sx={{
                  width: "24px",
                  height: "24px",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    width: "16px",
                    height: "20px",
                    border: "2px solid #12B76A",
                    borderRadius: "2px",
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: "-2px",
                      left: "6px",
                      width: "6px",
                      height: "6px",
                      border: "2px solid #12B76A",
                      borderBottom: "none",
                      borderRight: "none",
                      transform: "rotate(-45deg)",
                    },
                  }}
                />
              </Box>
            </Box>
            {/* Title */}
            <Stack spacing={0.5}>
              <Typography
                variant="h5"
                sx={{
                  fontSize: "28px",
                  fontWeight: 600,
                  color: "#111927",
                  lineHeight: "1.2",
                }}
              >
                Custom Questions
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#6C737F",
                  lineHeight: "20px",
                }}
              >
                Create Questions that will be asked to all clients during service booking.
              </Typography>
            </Stack>
          </Stack>
          {/* Close Button */}
          <IconButton
            onClick={handleClose}
            sx={{
              color: "#111927",
              backgroundColor: "#F3F4F6",
              padding: "8px",
              width: "32px",
              height: "32px",
              "&:hover": {
                backgroundColor: "#E5E7EB",
              },
            }}
          >
            <Close sx={{ fontSize: "18px" }} />
          </IconButton>
        </Stack>

        {/* Form Fields */}
        <Stack sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Question */}
          <Box>
            <DialogTextField
              fullWidth
              variant="outlined"
              label="Question"
              placeholder="e.g. What is the event location"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </Box>

          {/* Answer Type */}
          <Box>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#111927",
                marginBottom: "8px",
              }}
            >
              Answer Type
            </Typography>
            <FormControl fullWidth>
              <DialogSelect
                value={answerType}
                onChange={(e) => setAnswerType(e.target.value as string)}
                displayEmpty
                IconComponent={DropdownArrowIcon}
                MenuProps={{
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
                }}
                renderValue={(selected) => {
                  if (!selected) {
                    return <span style={{ color: "#6C737F" }}>Select</span>;
                  }
                  const selectedOption = answerTypeOptions.find(
                    (o) => o.value === selected
                  );
                  return selectedOption ? selectedOption.label : "";
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
              </DialogSelect>
            </FormControl>
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
                    <DialogTextField
                      fullWidth
                      variant="outlined"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      sx={{
                        "& .MuiInputBase-root": {
                          paddingRight: "8px",
                        },
                        "& .MuiInputLabel-root": {
                          display: "none",
                        },
                      }}
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
                startIcon={<Add sx={{ color: "#111927", fontSize: "18px" }} />}
                onClick={handleAddOption}
                sx={{
                  color: "#111927",
                  textTransform: "none",
                  fontSize: "14px",
                  fontWeight: 500,
                  mt: 1,
                  alignSelf: "flex-end",
                  padding: "4px 8px",
                  minWidth: "auto",
                  "&:hover": {
                    backgroundColor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                + Add Options
              </Button>
            </Box>
          )}

          {/* Add Question Button */}
          <Button
            startIcon={
              <Add
                sx={{
                  color: "#0D4FAB",
                  fontSize: "20px",
                }}
              />
            }
            onClick={handleAddQuestion}
            disabled={!question.trim() || !answerType || (showOptions && options.filter((opt) => opt.trim() !== "").length < 2)}
            sx={{
              backgroundColor: "#E3F0F8",
              color: "#0D4FAB",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 500,
              alignSelf: "flex-start",
              padding: "10px 16px",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#D2E7F5",
              },
              "&:disabled": {
                backgroundColor: "#F3F4F6",
                color: "#9DA4AE",
              },
            }}
          >
            + Add Questions
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
            onClick={handleClose}
            sx={{
              backgroundColor: "#F3F4F6",
              color: "#111927",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 500,
              padding: "12px 24px",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#E5E7EB",
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
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#384250",
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
    </Box>
  );
}
