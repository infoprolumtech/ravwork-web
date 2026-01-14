import React, { type JSX } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  IconButton,
  MenuItem,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { DeleteOutline, Edit } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { StyledTextField } from "../../../utils/helper";
import { customQuestionSchema } from "../validationSchemas";

interface CustomQuestionsPageProps {
  onBack: () => void;
  onCancel: () => void;
  onSubmit: (data: CustomQuestionData[]) => void;
  initialQuestions?: CustomQuestionData[] | null;
  isSubmitting?: boolean;
}

export interface CustomQuestionData {
  question: string;
  answerType: string;
  options?: string[];
  label?: string;
  fieldType?: string;
  placeholder?: string;
  isRequired?: boolean;
  sortOrder?: number;
}

const answerTypeOptions = [
  { value: "short_text", label: "Short Text" },
  { value: "long_text", label: "Long Text" },
  { value: "single_choice", label: "Single choice (dropdown)" },
  { value: "multiselect", label: "Multichoice" },
  { value: "date_time", label: "Date & Time" },
  { value: "image", label: "Image Upload" },
];

interface QuestionFormData {
  question: string;
  answerType: string;
  options: string[];
  isRequired: boolean;
}

export default function CustomQuestionsPage({
  onBack: _onBack,
  onCancel,
  onSubmit,
  initialQuestions,
  isSubmitting = false,
}: CustomQuestionsPageProps): JSX.Element {
  const [options, setOptions] = React.useState<string[]>(["", ""]);
  const [createdQuestions, setCreatedQuestions] = React.useState<CustomQuestionData[]>(initialQuestions || []);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [editingSortOrder, setEditingSortOrder] = React.useState<number | undefined>(undefined);

  const form = useForm<QuestionFormData>({
    resolver: yupResolver(customQuestionSchema) as any,
    mode: "onChange",
    defaultValues: {
      question: "",
      answerType: "",
      options: ["", ""],
      isRequired: false,
    },
  });

  const question = form.watch("question");
  const answerType = form.watch("answerType");

  // Update state when initialQuestions changes
  React.useEffect(() => {
    if (initialQuestions) {
      // Convert legacy "date" or "time" answerTypes to "date_time"
      const normalizedQuestions = initialQuestions.map(q => ({
        ...q,
        answerType: (q.answerType === "date" || q.answerType === "time") ? "date_time" : q.answerType
      }));
      setCreatedQuestions(normalizedQuestions);
    }
  }, [initialQuestions]);

  const showOptions = answerType === "single_choice" || answerType === "multiselect";

  const handleAddOption = () => {
    const newOptions = [...options, ""];
    setOptions(newOptions);
    form.setValue("options", newOptions);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 1) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      form.setValue("options", newOptions);
      form.trigger("options");
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    form.setValue("options", newOptions);
    form.trigger("options");
  };

  const handleEditQuestion = (index: number) => {
    // Sort questions first to get the correct question at index
    const sortedQuestions = [...createdQuestions].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    const questionToEdit = sortedQuestions[index];
    form.setValue("question", questionToEdit.question);
    // Convert legacy "date" or "time" to "date_time" for display
    const answerTypeToSet = (questionToEdit.answerType === "date" || questionToEdit.answerType === "time") 
      ? "date_time" 
      : questionToEdit.answerType;
    form.setValue("answerType", answerTypeToSet);
    form.setValue("isRequired", questionToEdit.isRequired || false);
    
    // Store the sortOrder for when we re-add the question
    setEditingSortOrder(questionToEdit.sortOrder);
    
    // Set options if they exist, otherwise set default empty options
    if (questionToEdit.options && questionToEdit.options.length > 0) {
      const newOptions = [...questionToEdit.options, ""]; // Add one empty option for adding more
      setOptions(newOptions);
      form.setValue("options", newOptions);
    } else {
      setOptions(["", ""]);
      form.setValue("options", ["", ""]);
    }
    
    setEditingIndex(index);
    // Remove the question from the list (will be re-added when user clicks "Add Questions")
    const newQuestions = createdQuestions.filter((q) => q !== questionToEdit);
    setCreatedQuestions(newQuestions);
  };

  const handleAddQuestion = (data: QuestionFormData) => {
    // Map answerType to fieldType
    const mapAnswerTypeToFieldType = (answerType: string): string => {
      switch (answerType) {
        case "short_text": return "text";
        case "long_text": return "textarea";
        case "single_choice": return "select";
        case "multiselect": return "checkbox";
        case "date_time": return "date";
        case "date": return "date";
        case "time": return "time";
        case "image": return "images";
        default: return "text";
      }
    };

    const questionData: CustomQuestionData = {
      question: data.question.trim(),
      answerType: data.answerType,
      options: showOptions ? data.options.filter((opt) => opt.trim() !== "") : undefined,
      label: data.question.trim(),
      fieldType: mapAnswerTypeToFieldType(data.answerType),
      isRequired: data.isRequired || false,
    };

    if (editingIndex !== null && editingSortOrder !== undefined) {
      // If editing, preserve the original sortOrder
      questionData.sortOrder = editingSortOrder;
      
      // Add the question back
      setCreatedQuestions([...createdQuestions, questionData]);
      setEditingIndex(null);
      setEditingSortOrder(undefined);
    } else {
      // If adding new, assign sortOrder based on current length
      questionData.sortOrder = createdQuestions.length;
      setCreatedQuestions([...createdQuestions, questionData]);
    }
    
    form.reset({
      question: "",
      answerType: "",
      options: ["", ""],
      isRequired: false,
    });
    setOptions(["", ""]);
  };

  const handleCreateQuestion = () => {
    if (createdQuestions.length === 0 && (!question.trim() || !answerType)) {
      return;
    }

    // Map answerType to fieldType
    const mapAnswerTypeToFieldType = (answerType: string): string => {
      switch (answerType) {
        case "short_text": return "text";
        case "long_text": return "textarea";
        case "single_choice": return "select";
        case "multiselect": return "checkbox";
        case "date_time": return "date";
        case "date": return "date";
        case "time": return "time";
        case "image": return "images";
        default: return "text";
      }
    };

    // If there's a current question being filled, add it first
    if (question.trim() && answerType) {
      const isRequiredValue = form.getValues("isRequired") || false;
      const questionData: CustomQuestionData = {
        question: question.trim(),
        answerType,
        options: showOptions ? options.filter((opt) => opt.trim() !== "") : undefined,
        label: question.trim(),
        fieldType: mapAnswerTypeToFieldType(answerType),
        isRequired: isRequiredValue,
        sortOrder: createdQuestions.length,
      };
      const allQuestions = [...createdQuestions, questionData];
      // Sort by sortOrder before submitting
      const sortedQuestions = allQuestions.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      onSubmit(sortedQuestions);
    } else {
      // Sort by sortOrder before submitting
      const sortedQuestions = [...createdQuestions].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      onSubmit(sortedQuestions);
    }
  };

  // Reset options when answer type changes
  React.useEffect(() => {
    if (showOptions) {
      if (options.length < 2) {
        const newOptions = ["", ""];
        setOptions(newOptions);
        form.setValue("options", newOptions);
      }
    } else {
      setOptions([]);
      form.setValue("options", []);
    }
  }, [answerType, showOptions, form]);

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
          <Controller
            name="question"
            control={form.control}
            render={({ field }) => (
          <StyledTextField
                {...field}
            fullWidth
            variant="outlined"
            label="Question"
            placeholder="e.g. What is the event location"
                error={Boolean(form.formState.errors.question)}
                helperText={form.formState.errors.question?.message}
            sx={{ mt: 2 }}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  form.trigger("question");
                }}
              />
            )}
          />
        </Box>

        {/* Answer Type */}
        <Box>
          <Controller
            name="answerType"
            control={form.control}
            render={({ field }) => (
          <StyledTextField
                {...field}
            fullWidth
            variant="outlined"
            label="Answer Type"
                error={Boolean(form.formState.errors.answerType)}
                helperText={form.formState.errors.answerType?.message}
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
            )}
          />
        </Box>

        {/* Required Toggle */}
        <Box>
          <Controller
            name="isRequired"
            control={form.control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    {...field}
                    checked={field.value || false}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#111927",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: "#111927",
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#111927",
                    }}
                  >
                    Required
                  </Typography>
                }
              />
            )}
          />
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
          onClick={form.handleSubmit(handleAddQuestion)}
          disabled={!form.formState.isValid || (showOptions && options.filter((opt) => opt.trim() !== "").length < 2)}
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
              {[...createdQuestions]
                .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                .map((q, index) => {
                // Handle both new "date_time" and legacy "date"/"time" answerTypes
                let answerTypeToLookup = q.answerType;
                if (q.answerType === "date" || q.answerType === "time") {
                  answerTypeToLookup = "date_time";
                }
                const answerTypeLabel = answerTypeOptions.find(
                  (opt) => opt.value === answerTypeToLookup
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
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: q.options && q.options.length > 0 ? 1 : 0 }}>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontWeight: 400,
                              color: "#6C737F",
                            }}
                          >
                            Answer Type: {answerTypeLabel}
                          </Typography>
                          {q.isRequired && (
                            <Typography
                              sx={{
                                fontSize: "12px",
                                fontWeight: 500,
                                color: "#F04438",
                                
                                px: 1,
                                py: 0.25,
                                borderRadius: "4px",
                              }}
                            >
                              Required
                            </Typography>
                          )}
                        </Stack>
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
          disabled={isSubmitting || (createdQuestions.length === 0 && (!question.trim() || !answerType))}
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
          {isSubmitting ? (
            <>
              <CircularProgress size={16} sx={{ color: "#FFFFFF", mr: 1 }} />
              Creating...
            </>
          ) : (
            "Next"
          )}
        </Button>
      </Stack>
    </Stack>
  );
}


