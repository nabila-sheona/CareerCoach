import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Chip,
  CircularProgress,
  TextField,
  Divider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Mic as InterviewIcon,
  Videocam as VideoIcon,
  ExpandMore,
  Psychology,
  RecordVoiceOver,
  SmartToy,
} from "@mui/icons-material";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAJSPTk7_Bmrff_2AHNdWjIhhJTEPA3LYM";
const genAI = new GoogleGenerativeAI(API_KEY);

// Gemini Service for Mock Interviews
const geminiInterviewService = {
  async generateInterviewQuestions(jobRole, experienceLevel, company = "") {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
Generate 5-7 comprehensive interview questions for a ${experienceLevel} ${jobRole} position${
        company ? ` at ${company}` : ""
      }. 
For each question, provide:

1. The question itself
2. What the interviewer is looking for (intent/assessment criteria)
3. An ideal answer
4. Key keywords that should be included in a good response

Please provide the output in the following JSON format:
{
  "questions": [
    {
      "question": "Question text here",
      "intent": "What the interviewer is assessing",
      "idealAnswer": "Comprehensive ideal answer",
      "keywords": ["keyword1", "keyword2", "keyword3"]
    }
  ]
}

Make the questions relevant to the role and experience level. Include a mix of:
- Technical/skill-based questions
- Behavioral questions (STAR method)
- Situational questions
- Company/culture fit questions

Ensure the questions are appropriate for ${experienceLevel} level candidates.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse interview questions");
      }
    } catch (error) {
      console.error("Error generating interview questions:", error);
      throw new Error(
        "Failed to generate interview questions. Please try again."
      );
    }
  },
};

const MockInterviews = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("entry-level");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [interviewData, setInterviewData] = useState(null);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const jobRoles = [
    { value: "software-engineer", label: "Software Engineer" },
    { value: "frontend-developer", label: "Frontend Developer" },
    { value: "backend-developer", label: "Backend Developer" },
    { value: "fullstack-developer", label: "Full Stack Developer" },
    { value: "data-analyst", label: "Data Analyst" },
    { value: "data-scientist", label: "Data Scientist" },
    { value: "devops-engineer", label: "DevOps Engineer" },
    { value: "qa-engineer", label: "QA Engineer" },
    { value: "product-manager", label: "Product Manager" },
    { value: "project-manager", label: "Project Manager" },
    { value: "ui-ux-designer", label: "UI/UX Designer" },
    { value: "digital-marketer", label: "Digital Marketer" },
    { value: "hr-specialist", label: "HR Specialist" },
    { value: "business-analyst", label: "Business Analyst" },
    { value: "sales-executive", label: "Sales Executive" },
    { value: "customer-support", label: "Customer Support" },
    { value: "content-writer", label: "Content Writer" },
    { value: "graphic-designer", label: "Graphic Designer" },
    { value: "network-engineer", label: "Network Engineer" },
    { value: "cybersecurity-analyst", label: "Cybersecurity Analyst" },
  ];

  const experienceOptions = [
    { value: "entry-level", label: "Entry Level (0-2 years)" },
    { value: "mid-level", label: "Mid Level (3-5 years)" },
    { value: "senior", label: "Senior (5+ years)" },
    { value: "lead", label: "Lead/Manager (7+ years)" },
    { value: "executive", label: "Executive/Director (10+ years)" },
  ];

  const handleStartInterview = async () => {
    if (!selectedRole) {
      setError("Please select a job role");
      return;
    }

    setLoading(true);
    setError(null);
    setInterviewData(null);
    setUserAnswers({});

    try {
      const data = await geminiInterviewService.generateInterviewQuestions(
        jobRoles.find((r) => r.value === selectedRole)?.label || selectedRole,
        experienceLevel,
        company
      );
      setInterviewData(data);
    } catch (err) {
      console.error("Interview generation error:", err);
      setError(
        err.message ||
          "Failed to generate interview questions. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index, answer) => {
    setUserAnswers((prev) => ({ ...prev, [index]: answer }));
  };

  const handleExpandQuestion = (index) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  return (
    <Box sx={{ py: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <InterviewIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            AI Mock Interviews
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Get realistic, AI-powered interview questions with ideal answers
          </Typography>
        </Box>

        {/* Setup Card */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Set Up Your Mock Interview
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose a job role and experience level to get customized
              questions.
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Job Role *</InputLabel>
                <Select
                  value={selectedRole}
                  label="Job Role *"
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  {jobRoles.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Experience Level</InputLabel>
                <Select
                  value={experienceLevel}
                  label="Experience Level"
                  onChange={(e) => setExperienceLevel(e.target.value)}
                >
                  {experienceOptions.map((exp) => (
                    <MenuItem key={exp.value} value={exp.value}>
                      {exp.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Company (optional)"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., Google, Microsoft, Startup XYZ"
              />
            </Box>

            <Box sx={{ mb: 3, mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                AI-Powered Features:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: "center",
                }}
              >
                <Chip
                  icon={<Psychology />}
                  label="Role-Specific Questions"
                  variant="outlined"
                />
                <Chip
                  icon={<RecordVoiceOver />}
                  label="Behavioral + Technical"
                  variant="outlined"
                />
                <Chip
                  icon={<SmartToy />}
                  label="Ideal Answers"
                  variant="outlined"
                />
              </Box>
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              disabled={!selectedRole || loading}
              onClick={handleStartInterview}
              startIcon={
                loading ? <CircularProgress size={20} /> : <VideoIcon />
              }
            >
              {loading ? "Generating Questions..." : "Start Mock Interview"}
            </Button>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Generated Questions */}
        {interviewData && interviewData.questions && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <VideoIcon color="primary" sx={{ mr: 2 }} />
              <Typography variant="h5">
                Interview Questions for{" "}
                {jobRoles.find((r) => r.value === selectedRole)?.label}
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Practice answering these questions aloud or type your responses.
              Each question includes what the interviewer is looking for and an
              ideal answer.
            </Typography>

            {interviewData.questions.map((q, idx) => (
              <Accordion
                key={idx}
                expanded={expandedQuestion === idx}
                onChange={() => handleExpandQuestion(idx)}
                sx={{ mb: 2 }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" sx={{ width: "100%" }}>
                    Q{idx + 1}: {q.question}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      color="primary"
                    >
                      What the interviewer is looking for:
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {q.intent}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      color="primary"
                    >
                      Your Answer:
                    </Typography>
                    <TextField
                      multiline
                      rows={3}
                      fullWidth
                      placeholder="Type your answer here..."
                      value={userAnswers[idx] || ""}
                      onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      color="success.main"
                    >
                      Ideal Answer:
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, bgcolor: "success.50" }}
                    >
                      <Typography variant="body2">{q.idealAnswer}</Typography>
                    </Paper>
                  </Box>

                  {q.keywords && q.keywords.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Keywords to include: {q.keywords.join(", ")}
                      </Typography>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}

            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => {
                setInterviewData(null);
                setUserAnswers({});
              }}
            >
              Generate New Questions
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default MockInterviews;
