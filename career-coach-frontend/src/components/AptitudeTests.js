import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  LinearProgress,
  TextField,
  Grid,
} from "@mui/material";
import {
  Psychology as TestIcon,
  Timer,
  PlayArrow,
  Stop,
} from "@mui/icons-material";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAJSPTk7_Bmrff_2AHNdWjIhhJTEPA3LYM";
const genAI = new GoogleGenerativeAI(API_KEY);

// Gemini Service
const geminiService = {
  async generateAptitudeTest(jobDescription, role, company) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
Generate a 10-question multiple choice aptitude test for a candidate applying for the role of ${role} 
at ${company || "a company"}. The job description is: ${jobDescription}

Please provide the questions in the following JSON format:
{
  "questions": [
    {
      "question": "Question text here",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": 0
    }
  ]
}

Make sure the questions are relevant to the role and job description. Include a mix of:
- Technical knowledge questions
- Problem-solving scenarios
- Industry-specific knowledge
- Situational judgment questions

Ensure the correctAnswer is the index of the correct option (0-3).
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse test questions");
      }
    } catch (error) {
      console.error("Error generating test:", error);
      throw new Error("Failed to generate test. Please try again.");
    }
  },
};

const AptitudeTestGenerator = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [testData, setTestData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Timer useEffect
  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && !testCompleted) {
      handleTestCompletion();
    }

    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft, testCompleted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleGenerateTest = async () => {
    if (!jobDescription.trim() || !role.trim()) {
      setError("Please provide both job description and role");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const test = await geminiService.generateAptitudeTest(
        jobDescription,
        role,
        company
      );
      setTestData(test);
      setCurrentQuestion(0);
      setAnswers({});
      setTestCompleted(false);
      setScore(0);
      setTimeLeft(300);
      setIsTimerRunning(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answerIndex }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < testData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleTestCompletion();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleTestCompletion = () => {
    setIsTimerRunning(false);
    setTestCompleted(true);
    calculateScore();
  };

  const calculateScore = () => {
    let correct = 0;
    testData.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
      }
    });
    const calculatedScore = Math.round(
      (correct / testData.questions.length) * 100
    );
    setScore(calculatedScore);
  };

  const handleEndTestEarly = () => {
    if (window.confirm("Are you sure you want to end the test early?")) {
      handleTestCompletion();
    }
  };

  if (testCompleted && testData) {
    return (
      <Box sx={{ py: 8, bgcolor: "background.default", minHeight: "100vh" }}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <TestIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
            <Typography variant="h3" gutterBottom fontWeight="bold">
              Test Completed!
            </Typography>
            <Alert
              severity={
                score >= 70 ? "success" : score >= 50 ? "warning" : "error"
              }
              sx={{ mb: 3 }}
            >
              Your Score: <strong>{score}%</strong> (
              {Math.round((score / 100) * testData.questions.length)}/
              {testData.questions.length} correct)
            </Alert>

            <Box sx={{ mt: 4, textAlign: "left" }}>
              <Typography variant="h5" gutterBottom>
                Review Your Answers:
              </Typography>
              {testData.questions.map((q, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 2,
                    bgcolor:
                      answers[index] === q.correctAnswer
                        ? "success.light"
                        : "error.light",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">{q.question}</Typography>
                    <Box sx={{ mt: 1 }}>
                      {q.options.map((option, optIndex) => (
                        <Box
                          key={optIndex}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color:
                              optIndex === q.correctAnswer
                                ? "success.main"
                                : optIndex === answers[index] &&
                                  optIndex !== q.correctAnswer
                                ? "error.main"
                                : "text.primary",
                          }}
                        >
                          <Radio
                            checked={
                              optIndex === answers[index] ||
                              optIndex === q.correctAnswer
                            }
                          />
                          {option}
                          {optIndex === q.correctAnswer && " ✓"}
                          {optIndex === answers[index] &&
                            optIndex !== q.correctAnswer &&
                            " ✗"}
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Button
              variant="contained"
              onClick={() => setTestData(null)}
              sx={{ mt: 3 }}
            >
              Create New Test
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  if (testData) {
    const question = testData.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / testData.questions.length) * 100;

    return (
      <Box sx={{ py: 8, bgcolor: "background.default", minHeight: "100vh" }}>
        <Container maxWidth="md">
          {/* Timer and Progress */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Timer
                sx={{
                  mr: 1,
                  color: timeLeft < 60 ? "error.main" : "primary.main",
                }}
              />
              <Typography
                variant="h6"
                color={timeLeft < 60 ? "error.main" : "primary.main"}
              >
                {formatTime(timeLeft)}
              </Typography>
            </Box>

            <Button
              variant="outlined"
              color="error"
              onClick={handleEndTestEarly}
              startIcon={<Stop />}
            >
              End Test
            </Button>
          </Box>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" sx={{ mb: 3 }}>
            Question {currentQuestion + 1} of {testData.questions.length}
          </Typography>

          {/* Question */}
          <Card>
            <CardContent sx={{ p: 4 }}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel
                  component="legend"
                  sx={{ mb: 3, fontSize: "1.1rem", fontWeight: "bold" }}
                >
                  {question.question}
                </FormLabel>
                <RadioGroup
                  value={answers[currentQuestion] ?? ""}
                  onChange={(e) =>
                    handleAnswerSelect(
                      currentQuestion,
                      parseInt(e.target.value)
                    )
                  }
                >
                  {question.options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={index}
                      control={<Radio />}
                      label={option}
                      sx={{
                        mb: 2,
                        p: 1,
                        border: "1px solid",
                        borderColor: "grey.300",
                        borderRadius: 1,
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              {/* Navigation Buttons */}
              <Box
                sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  variant="outlined"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>

                <Button
                  variant="contained"
                  onClick={handleNextQuestion}
                  disabled={answers[currentQuestion] === undefined}
                >
                  {currentQuestion === testData.questions.length - 1
                    ? "Finish Test"
                    : "Next Question"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 8, bgcolor: "background.default", minHeight: "100vh" }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <TestIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            AI-Powered Aptitude Test Generator
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Get personalized aptitude tests based on your target job role and
            description
          </Typography>
        </Box>

        <Card sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Role you're applying for *"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Software Engineer, Marketing Manager, Data Analyst"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company (optional)"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., Google, Microsoft, Local Startup"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Job Description *"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description or describe the role requirements..."
              />
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleGenerateTest}
                disabled={isLoading}
                startIcon={isLoading ? null : <PlayArrow />}
              >
                {isLoading ? (
                  <>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Generating Test Questions...
                    </Box>
                  </>
                ) : (
                  "Generate Aptitude Test"
                )}
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Alert severity="info">
                <strong>Note:</strong> The test will include 10 questions and a
                5-minute timer. Questions are generated using AI based on your
                job description.
              </Alert>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Box>
  );
};

export default AptitudeTestGenerator;
