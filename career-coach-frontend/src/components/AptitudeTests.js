import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  LinearProgress,
} from "@mui/material";
import { Psychology as TestIcon } from "@mui/icons-material";

const AptitudeTests = () => {
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testCompleted, setTestCompleted] = useState(false);

  const testCategories = [
    {
      id: "banking",
      title: "Banking & Finance",
      description: "Bangladesh Bank, private bank exams, financial aptitude",
      questions: [
        {
          question: "What is the repo rate currently set by Bangladesh Bank?",
          options: ["4.75%", "5.00%", "5.25%", "5.50%"],
          correct: 1,
        },
        {
          question: "Which of these is NOT a function of Bangladesh Bank?",
          options: [
            "Currency issuance",
            "Fiscal policy formulation",
            "Banker to the government",
            "Foreign exchange management",
          ],
          correct: 1,
        },
      ],
    },
    {
      id: "technology",
      title: "Technology",
      description: "Software development, IT concepts, programming logic",
      questions: [
        {
          question: "What does API stand for?",
          options: [
            "Application Programming Interface",
            "Advanced Programming Interface",
            "Application Process Integration",
            "Automated Programming Interface",
          ],
          correct: 0,
        },
      ],
    },
  ];

  const handleStartTest = (testId) => {
    const test = testCategories.find((t) => t.id === testId);
    setSelectedTest(test);
    setCurrentQuestion(0);
    setAnswers({});
    setTestCompleted(false);
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answerIndex }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < selectedTest.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setTestCompleted(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    selectedTest.questions.forEach((question, index) => {
      if (answers[index] === question.correct) {
        correct++;
      }
    });
    return Math.round((correct / selectedTest.questions.length) * 100);
  };

  if (testCompleted) {
    const score = calculateScore();
    return (
      <Box sx={{ py: 8, bgcolor: "background.default", minHeight: "100vh" }}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <TestIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
            <Typography variant="h3" gutterBottom fontWeight="bold">
              Test Completed!
            </Typography>
            <Alert
              severity={score >= 70 ? "success" : "warning"}
              sx={{ mb: 3 }}
            >
              Your Score: <strong>{score}%</strong>
            </Alert>
            <Button variant="contained" onClick={() => setSelectedTest(null)}>
              Take Another Test
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  if (selectedTest) {
    const question = selectedTest.questions[currentQuestion];
    const progress =
      ((currentQuestion + 1) / selectedTest.questions.length) * 100;

    return (
      <Box sx={{ py: 8, bgcolor: "background.default", minHeight: "100vh" }}>
        <Container maxWidth="md">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {selectedTest.title} Test
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ mb: 2 }}
            />
            <Typography variant="body2">
              Question {currentQuestion + 1} of {selectedTest.questions.length}
            </Typography>
          </Box>

          <Card>
            <CardContent sx={{ p: 4 }}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel
                  component="legend"
                  sx={{ mb: 3, fontSize: "1.1rem" }}
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

              <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  onClick={handleNextQuestion}
                  disabled={answers[currentQuestion] === undefined}
                >
                  {currentQuestion === selectedTest.questions.length - 1
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
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <TestIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Aptitude Tests
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Practice domain-specific tests tailored for Bangladeshi job market
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {testCategories.map((test) => (
            <Grid item xs={12} md={6} key={test.id}>
              <Card
                sx={{
                  height: "100%",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-4px)" },
                }}
              >
                <CardContent sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    {test.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    {test.description}
                  </Typography>
                  <Chip
                    label={`${test.questions.length} questions`}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleStartTest(test.id)}
                    startIcon={<TestIcon />}
                  >
                    Start Test
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AptitudeTests;
