import React, { useState, useRef, useEffect } from "react";
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
  IconButton,
  Slider,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideoIcon,
  Psychology,
  RecordVoiceOver,
  SmartToy,
  PlayArrow,
  Stop,
  Upload,
  Delete,
  VolumeUp,
} from "@mui/icons-material";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAJSPTk7_Bmrff_2AHNdWjIhhJTEPA3LYM";
const genAI = new GoogleGenerativeAI(API_KEY);

// Gemini Service for Mock Interviews
const geminiInterviewService = {
  async generateInterviewQuestions(
    cvText,
    jobRole,
    experienceLevel,
    company = ""
  ) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
Based on the following CV and job requirements, generate 5-7 comprehensive interview questions.

CV CONTENT:
${cvText || "No CV provided"}

JOB ROLE: ${jobRole}
EXPERIENCE LEVEL: ${experienceLevel}
COMPANY: ${company || "Not specified"}

For each question, provide:

1. The question itself (make it conversational as if asking in real interview)
2. What the interviewer is looking for (intent/assessment criteria)
3. An ideal answer
4. Key keywords that should be included in a good response

Please provide the output in the following JSON format:
{
  "questions": [
    {
      "question": "Question text here (make it conversational)",
      "intent": "What the interviewer is assessing",
      "idealAnswer": "Comprehensive ideal answer",
      "keywords": ["keyword1", "keyword2", "keyword3"]
    }
  ]
}

Make the questions personalized based on the CV content. Include a mix of:
- Technical/skill-based questions specific to the CV
- Behavioral questions (STAR method) relevant to experience
- Situational questions based on the role
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

  async analyzeAnswer(question, userAnswer, cvText = "") {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
Analyze this interview answer and provide feedback:

QUESTION: ${question}

USER'S ANSWER: ${userAnswer}

CV CONTEXT: ${cvText || "No CV provided"}

Please provide feedback in the following JSON format:
{
  "feedback": "Comprehensive feedback on the answer",
  "strengths": ["strength1", "strength2"],
  "improvements": ["area1 to improve", "area2 to improve"],
  "score": 85,
  "keywordsMissing": ["keyword1", "keyword2"],
  "suggestion": "How to improve this answer"
}

Focus on:
- Relevance to the question
- Use of STAR method (if behavioral question)
- Technical accuracy (if technical question)
- Clarity and structure
- Alignment with CV experience
- Professional tone and confidence
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse feedback");
      }
    } catch (error) {
      console.error("Error analyzing answer:", error);
      throw new Error("Failed to analyze answer. Please try again.");
    }
  },
};

// Text-to-Speech function
const speakText = (text, voice = null, rate = 1.0, pitch = 1.0) => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = rate;
    speech.pitch = pitch;

    if (voice) {
      speech.voice = voice;
    }

    window.speechSynthesis.speak(speech);
    return speech;
  }
  return null;
};

// Speech-to-Text function with manual control
const createSpeechRecognition = () => {
  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    return new SpeechRecognition();
  }
  return null;
};

const MockInterviews = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("entry-level");
  const [company, setCompany] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [cvText, setCvText] = useState("");
  const [loading, setLoading] = useState(false);
  const [interviewData, setInterviewData] = useState(null);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [interviewState, setInterviewState] = useState("setup");
  const [voiceSettings, setVoiceSettings] = useState({
    rate: 1.0,
    pitch: 1.0,
    voice: null,
  });
  const [voices, setVoices] = useState([]);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [recordingInstructions, setRecordingInstructions] = useState("");

  const recognitionRef = useRef(null);
  const accumulatedAnswerRef = useRef(""); // Stores the complete accumulated answer
  const pauseTimeoutRef = useRef(null); // Timeout for auto-pause

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
  ];

  const experienceOptions = [
    { value: "entry-level", label: "Entry Level (0-2 years)" },
    { value: "mid-level", label: "Mid Level (3-5 years)" },
    { value: "senior", label: "Senior (5+ years)" },
    { value: "lead", label: "Lead/Manager (7+ years)" },
  ];

  // Initialize speech recognition
  useEffect(() => {
    const initSpeechRecognition = () => {
      const recognition = createSpeechRecognition();
      if (recognition) {
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
          // Clear any existing pause timeout
          if (pauseTimeoutRef.current) {
            clearTimeout(pauseTimeoutRef.current);
          }

          let finalTranscript = "";

          // Process only new results since the last event
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + " ";
            }
          }

          if (finalTranscript) {
            // Append only the new transcript to the accumulated answer
            accumulatedAnswerRef.current += finalTranscript;

            // Update the UI with the complete accumulated answer
            setUserAnswers((prev) => ({
              ...prev,
              [currentQuestion]: accumulatedAnswerRef.current,
            }));

            // Set a timeout to auto-stop after 3 seconds of silence
            pauseTimeoutRef.current = setTimeout(() => {
              if (isRecording) {
                setRecordingInstructions(
                  "Recording paused due to silence. Click 'Continue Recording' to add more."
                );
                stopRecording();
              }
            }, 3000);
          }
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          if (event.error === "no-speech") {
            setRecordingInstructions(
              "No speech detected. Please speak clearly into your microphone."
            );
            return;
          }
          setError("Speech recognition error: " + event.error);
        };

        recognition.onend = () => {
          if (isRecording) {
            // This handles cases where the recognition stops unexpectedly
            setIsRecording(false);
          }
        };

        recognitionRef.current = recognition;
      }
    };

    initSpeechRecognition();

    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, [isRecording, currentQuestion]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !voiceSettings.voice) {
        setVoiceSettings((prev) => ({
          ...prev,
          voice:
            availableVoices.find((v) => v.lang.includes("en")) ||
            availableVoices[0],
        }));
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  // Update the ref when question changes or when manually editing
  useEffect(() => {
    accumulatedAnswerRef.current = userAnswers[currentQuestion] || "";
    setRecordingInstructions("");
  }, [currentQuestion, userAnswers]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "text/plain",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError("Please upload a PDF, DOCX, or TEXT file only.");
        return;
      }

      setUploadedFile(file);
      setError(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        setCvText(e.target.result.substring(0, 1000) + "...");
      };
      reader.readAsText(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setCvText("");
  };

  const handleStartInterview = async () => {
    if (!selectedRole) {
      setError("Please select a job role");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await geminiInterviewService.generateInterviewQuestions(
        cvText,
        jobRoles.find((r) => r.value === selectedRole)?.label || selectedRole,
        experienceLevel,
        company
      );
      setInterviewData(data);
      setInterviewState("in-progress");
      setCurrentQuestion(0);
      setUserAnswers({});
      setFeedback({});
      accumulatedAnswerRef.current = "";
      setRecordingInstructions("");
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

  const speakQuestion = (questionIndex) => {
    if (interviewData && interviewData.questions[questionIndex]) {
      window.speechSynthesis.cancel();
      const question = interviewData.questions[questionIndex].question;
      const speech = speakText(
        question,
        voiceSettings.voice,
        voiceSettings.rate,
        voiceSettings.pitch
      );

      if (speech) {
        setIsSpeaking(true);
        speech.onend = () => setIsSpeaking(false);
        speech.onerror = () => setIsSpeaking(false);
      }
    }
  };

  const startRecording = () => {
    if (recognitionRef.current) {
      setRecordingInstructions(
        "Recording... Speak clearly. Recording will auto-pause after 3 seconds of silence."
      );
      setIsRecording(true);
      try {
        recognitionRef.current.start();
      } catch (error) {
        if (error.toString().includes("already started")) {
          recognitionRef.current.stop();
          setTimeout(() => recognitionRef.current.start(), 100);
        } else {
          setError("Failed to start recording: " + error.message);
        }
      }
    } else {
      setError("Speech recognition is not supported in your browser");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      setIsRecording(false);
      try {
        recognitionRef.current.stop();
        setRecordingInstructions(
          "Recording stopped. Click 'Continue Recording' to add more to your answer."
        );
      } catch (error) {
        console.error("Error stopping recognition:", error);
      }
    }
  };

  const handleAnswerChange = (answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answer,
    }));
    accumulatedAnswerRef.current = answer;
    setRecordingInstructions("");
  };

  const analyzeAnswer = async () => {
    const currentAnswer = userAnswers[currentQuestion];
    if (!currentAnswer || currentAnswer.trim().length === 0) {
      setError("Please provide an answer first");
      return;
    }

    setLoading(true);
    try {
      const question = interviewData.questions[currentQuestion].question;
      const analysis = await geminiInterviewService.analyzeAnswer(
        question,
        currentAnswer,
        cvText
      );
      setFeedback((prev) => ({
        ...prev,
        [currentQuestion]: analysis,
      }));
    } catch (err) {
      setError("Failed to analyze answer: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < interviewData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setInterviewState("completed");
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const restartInterview = () => {
    setInterviewData(null);
    setInterviewState("setup");
    setCurrentQuestion(0);
    setUserAnswers({});
    setFeedback({});
    accumulatedAnswerRef.current = "";
    setRecordingInstructions("");
    window.speechSynthesis.cancel();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
  };

  return (
    <Box sx={{ py: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <VideoIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            AI Voice Mock Interviews
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Upload your CV, get personalized questions, and practice with voice
            interaction
          </Typography>
        </Box>

        {interviewState === "setup" && (
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Set Up Your Mock Interview
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Upload your CV and configure interview settings for personalized
                questions.
              </Typography>

              {/* CV Upload */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Upload Your CV (Optional but recommended)
                </Typography>
                {!uploadedFile ? (
                  <Box
                    sx={{
                      border: "2px dashed #ccc",
                      borderRadius: 2,
                      p: 3,
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => document.getElementById("cv-upload").click()}
                  >
                    <Upload
                      sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
                    />
                    <Typography>Click to upload your CV</Typography>
                    <Typography variant="caption" color="text.secondary">
                      PDF, DOCX, or TEXT files
                    </Typography>
                    <input
                      id="cv-upload"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleFileUpload}
                      accept=".pdf,.docx,.doc,.txt"
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 2,
                      border: "1px solid #ccc",
                      borderRadius: 1,
                    }}
                  >
                    <Typography>{uploadedFile.name}</Typography>
                    <IconButton onClick={removeFile} color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                )}
              </Box>

              {/* Interview Settings */}
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 3 }}
              >
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

                <FormControlLabel
                  control={
                    <Switch
                      checked={voiceSettings.voice !== null}
                      onChange={(e) => {
                        if (e.target.checked && voices.length > 0) {
                          setVoiceSettings((prev) => ({
                            ...prev,
                            voice:
                              voices.find((v) => v.lang.includes("en")) ||
                              voices[0],
                          }));
                        } else {
                          setVoiceSettings((prev) => ({
                            ...prev,
                            voice: null,
                          }));
                        }
                      }}
                    />
                  }
                  label="Enable AI Voice Questions"
                />

                {voiceSettings.voice && (
                  <Button
                    variant="outlined"
                    onClick={() => setShowVoiceSettings(true)}
                  >
                    Voice Settings
                  </Button>
                )}
              </Box>

              <Box sx={{ mb: 3 }}>
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
                    label="CV-Personalized Questions"
                    variant="outlined"
                  />
                  <Chip
                    icon={<RecordVoiceOver />}
                    label="Voice Interaction"
                    variant="outlined"
                  />
                  <Chip
                    icon={<SmartToy />}
                    label="Real-time Feedback"
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
                {loading ? "Generating Questions..." : "Start Voice Interview"}
              </Button>
            </CardContent>
          </Card>
        )}

        {interviewState === "in-progress" && interviewData && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5">
                Question {currentQuestion + 1} of{" "}
                {interviewData.questions.length}
              </Typography>
              <Button variant="outlined" onClick={restartInterview}>
                End Interview
              </Button>
            </Box>

            {/* Current Question */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {interviewData.questions[currentQuestion].question}
                  </Typography>
                  <IconButton
                    onClick={() => speakQuestion(currentQuestion)}
                    disabled={isSpeaking}
                    color="primary"
                  >
                    <VolumeUp />
                  </IconButton>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  <strong>What they're looking for:</strong>{" "}
                  {interviewData.questions[currentQuestion].intent}
                </Typography>
              </CardContent>
            </Card>

            {/* Answer Section */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Your Answer
                </Typography>

                <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                  {isRecording ? (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={stopRecording}
                      startIcon={<MicOffIcon />}
                    >
                      Stop Recording
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={startRecording}
                      startIcon={<MicIcon />}
                    >
                      {userAnswers[currentQuestion]
                        ? "Continue Recording"
                        : "Start Recording"}
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    onClick={() => speakQuestion(currentQuestion)}
                    disabled={isSpeaking}
                    startIcon={<VolumeUp />}
                  >
                    Hear Question Again
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={analyzeAnswer}
                    disabled={!userAnswers[currentQuestion] || loading}
                  >
                    {loading ? (
                      <CircularProgress size={20} />
                    ) : (
                      "Analyze Answer"
                    )}
                  </Button>
                </Box>

                {recordingInstructions && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    {recordingInstructions}
                  </Alert>
                )}

                <TextField
                  multiline
                  rows={6}
                  fullWidth
                  placeholder="Type or record your answer here. Click 'Start Recording' and speak your answer. The recording will automatically pause after 3 seconds of silence. Click 'Continue Recording' to add more."
                  value={userAnswers[currentQuestion] || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  helperText="You can type or use the recording buttons. Recording auto-pauses during silence to prevent repetition."
                />

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  💡 Tip: Speak in complete sentences, then pause. The system
                  will automatically stop and save your speech. Click "Continue
                  Recording" to add more when you're ready.
                </Typography>
              </CardContent>
            </Card>

            {/* Feedback Section */}
            {feedback[currentQuestion] && (
              <Card sx={{ mb: 3, bgcolor: "info.50" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    AI Feedback
                  </Typography>

                  <Typography variant="body2" paragraph>
                    <strong>Overall Feedback:</strong>{" "}
                    {feedback[currentQuestion].feedback}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Strengths:</Typography>
                    <ul>
                      {feedback[currentQuestion].strengths?.map(
                        (strength, idx) => (
                          <li key={idx}>{strength}</li>
                        )
                      )}
                    </ul>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">
                      Areas for Improvement:
                    </Typography>
                    <ul>
                      {feedback[currentQuestion].improvements?.map(
                        (improvement, idx) => (
                          <li key={idx}>{improvement}</li>
                        )
                      )}
                    </ul>
                  </Box>

                  <Typography variant="body2">
                    <strong>Score:</strong> {feedback[currentQuestion].score}
                    /100
                  </Typography>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="outlined"
                onClick={previousQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>

              <Button variant="contained" onClick={nextQuestion}>
                {currentQuestion === interviewData.questions.length - 1
                  ? "Finish Interview"
                  : "Next Question"}
              </Button>
            </Box>
          </Paper>
        )}

        {interviewState === "completed" && (
          <Card sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h4" gutterBottom color="success.main">
              Interview Completed! 🎉
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Great job completing the mock interview! You can review your
              answers and feedback.
            </Typography>
            <Button variant="contained" onClick={restartInterview}>
              Start New Interview
            </Button>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 4, mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* Voice Settings Dialog */}
        <Dialog
          open={showVoiceSettings}
          onClose={() => setShowVoiceSettings(false)}
        >
          <DialogTitle>Voice Settings</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Voice</InputLabel>
              <Select
                value={voiceSettings.voice ? voiceSettings.voice.name : ""}
                label="Voice"
                onChange={(e) => {
                  const selectedVoice = voices.find(
                    (v) => v.name === e.target.value
                  );
                  setVoiceSettings((prev) => ({
                    ...prev,
                    voice: selectedVoice,
                  }));
                }}
              >
                {voices
                  .filter((v) => v.lang.includes("en"))
                  .map((voice) => (
                    <MenuItem key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <Typography gutterBottom>
              Speech Rate: {voiceSettings.rate}
            </Typography>
            <Slider
              value={voiceSettings.rate}
              min={0.5}
              max={2}
              step={0.1}
              onChange={(e, newValue) =>
                setVoiceSettings((prev) => ({ ...prev, rate: newValue }))
              }
            />

            <Typography gutterBottom>Pitch: {voiceSettings.pitch}</Typography>
            <Slider
              value={voiceSettings.pitch}
              min={0.5}
              max={2}
              step={0.1}
              onChange={(e, newValue) =>
                setVoiceSettings((prev) => ({ ...prev, pitch: newValue }))
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowVoiceSettings(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MockInterviews;
