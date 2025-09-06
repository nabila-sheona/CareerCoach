import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  Grid,
  Paper,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Upload as UploadIcon,
  Description as CVIcon,
  CheckCircle,
  Warning,
  Lightbulb,
} from "@mui/icons-material";
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- Initialize Gemini AI ---
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

// --- Extract Text From PDF (mock implementation for now) ---
const extractTextFromPDF = async (file) => {
  console.log("Extracting text from file:", file.name);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate delay

  // In production, use pdf.js or a server-side extraction API
  return `
    John Doe
    Email: john.doe@email.com | Phone: +880 1712 345678
    
    EDUCATION
    B.Sc. in Computer Science and Engineering
    Bangladesh University of Engineering and Technology (BUET), 2018-2022
    CGPA: 3.75/4.00
    
    H.S.C. (Science)
    Notre Dame College, Dhaka, 2016-2018
    GPA: 5.00/5.00
    
    S.S.C. (Science)
    Motijheel Model High School, 2016
    GPA: 5.00/5.00
    
    TECHNICAL SKILLS
    Programming Languages: JavaScript, Python, Java
    Web Technologies: React, Node.js, Express, MongoDB
    Tools: Git, Docker, AWS
    
    EXPERIENCE
    Software Developer Intern
    Dynamic Solutions Ltd., Dhaka | June 2021 - August 2021
    - Developed web applications using React and Node.js
    - Collaborated with team members on project planning
    
    PROJECTS
    E-commerce Website
    - Built a full-stack e-commerce platform using MERN stack
    - Implemented user authentication and payment processing
    
    AWARDS
    Dean's List Award for academic excellence (2019, 2020)
  `;
};

// --- Analyze CV using Gemini ---
const analyzeCVWithGemini = async (cvText, jobRole, experienceLevel) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Analyze the following CV text for a ${experienceLevel} ${jobRole} position in Bangladesh.

    CV Text:
    ${cvText}

    Provide a JSON output with the following structure:
    {
      "score": 0-100,
      "summary": "Brief summary of overall CV",
      "strengths": ["list of strengths"],
      "improvements": ["list of improvement areas"],
      "suggestions": ["specific suggestions"],
      "keywords": ["list of important keywords for job role"]
    }

    Output ONLY valid JSON with no extra text or formatting.
  `;

  const result = await model.generateContent(prompt);
  let response = result.response.text();

  // Clean and parse the response safely
  response = response.replace(/```json|```/g, "").trim();
  const firstBrace = response.indexOf("{");
  const lastBrace = response.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("Invalid JSON structure returned from Gemini.");
  }

  const cleanJSON = response.slice(firstBrace, lastBrace + 1);
  return JSON.parse(cleanJSON);
};

// --- Generate AI Interview Questions ---
const generateInterviewQuestions = async (jobRole, experienceLevel) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Generate 5 interview questions for a ${experienceLevel} ${jobRole} candidate.
    Include a mix of technical, behavioral, and motivational questions.

    Format strictly as JSON:
    {
      "questions": [
        {
          "question": "string",
          "type": "technical|behavioral|motivational",
          "tips": "string"
        }
      ]
    }
  `;

  const result = await model.generateContent(prompt);
  let response = result.response.text();

  // Clean and parse the response safely
  response = response.replace(/```json|```/g, "").trim();
  const firstBrace = response.indexOf("{");
  const lastBrace = response.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("Invalid JSON structure returned from Gemini.");
  }

  const cleanJSON = response.slice(firstBrace, lastBrace + 1);
  return JSON.parse(cleanJSON);
};

// --- Main Component ---
const CVReview = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobRole, setJobRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [questions, setQuestions] = useState(null);

  const jobRoles = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Banking Officer",
    "Finance Analyst",
    "Marketing Executive",
  ];

  const experienceLevels = [
    "Entry Level",
    "Junior (1-3 years)",
    "Mid-Level (3-5 years)",
    "Senior (5+ years)",
  ];

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setExtractedText("");
    setAnalysisResult(null);
    setQuestions(null);
  };

  const handleExtractText = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      const text = await extractTextFromPDF(selectedFile);
      setExtractedText(text);
    } catch (error) {
      console.error("Error extracting text:", error);
      alert("Failed to extract text from CV. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeCV = async () => {
    if (!extractedText || !jobRole || !experienceLevel) return;
    setLoading(true);
    try {
      const result = await analyzeCVWithGemini(
        extractedText,
        jobRole,
        experienceLevel
      );
      setAnalysisResult(result);

      const questionsResult = await generateInterviewQuestions(
        jobRole,
        experienceLevel
      );
      setQuestions(questionsResult);
    } catch (error) {
      console.error("Error analyzing CV:", error);
      alert("AI analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setExtractedText("");
    setAnalysisResult(null);
    setJobRole("");
    setExperienceLevel("");
    setQuestions(null);
  };

  return (
    <Box sx={{ py: 4, bgcolor: "background.default", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <CVIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            AI CV Review
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Upload your CV for AI-powered analysis and personalized feedback
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Panel */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Upload Your CV
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Supported formats: PDF, DOC, DOCX. Get tailored feedback for
                  the Bangladeshi job market.
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    disabled={loading}
                  >
                    {selectedFile ? "Change File" : "Select CV File"}
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                  </Button>

                  {selectedFile && (
                    <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                      Selected: {selectedFile.name}
                    </Typography>
                  )}

                  {selectedFile && !extractedText && (
                    <Button
                      variant="contained"
                      onClick={handleExtractText}
                      disabled={loading}
                    >
                      {loading ? "Extracting Text..." : "Extract Text from CV"}
                    </Button>
                  )}
                </Box>

                {extractedText && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Extracted Text Preview
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        maxHeight: 200,
                        overflow: "auto",
                        fontSize: "0.8rem",
                        bgcolor: "grey.50",
                      }}
                    >
                      {extractedText.length > 500
                        ? extractedText.substring(0, 500) + "..."
                        : extractedText}
                    </Paper>

                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <InputLabel>Target Job Role</InputLabel>
                      <Select
                        value={jobRole}
                        label="Target Job Role"
                        onChange={(e) => setJobRole(e.target.value)}
                      >
                        {jobRoles.map((role) => (
                          <MenuItem key={role} value={role}>
                            {role}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <InputLabel>Experience Level</InputLabel>
                      <Select
                        value={experienceLevel}
                        label="Experience Level"
                        onChange={(e) => setExperienceLevel(e.target.value)}
                      >
                        {experienceLevels.map((level) => (
                          <MenuItem key={level} value={level}>
                            {level}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={handleAnalyzeCV}
                      disabled={!jobRole || !experienceLevel || loading}
                    >
                      {loading ? "Analyzing CV..." : "Analyze CV with AI"}
                    </Button>
                  </Box>
                )}

                {analysisResult && (
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleReset}
                  >
                    Analyze Another CV
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Right Panel */}
          <Grid item xs={12} md={6}>
            {loading && (
              <Box sx={{ mb: 3 }}>
                <LinearProgress />
                <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
                  Analyzing your CV with AI...
                </Typography>
              </Box>
            )}

            {analysisResult && (
              <Box>
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="h6">
                    CV Score: {analysisResult.score}%
                  </Typography>
                  <Typography variant="body2">
                    {analysisResult.summary}
                  </Typography>
                </Alert>

                {/* Strengths */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <CheckCircle color="success" sx={{ mr: 1 }} />
                      Strengths
                    </Typography>
                    <List dense>
                      {analysisResult.strengths.map((strength, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <CheckCircle color="success" />
                          </ListItemIcon>
                          <ListItemText primary={strength} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>

                {/* Improvements */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Warning color="warning" sx={{ mr: 1 }} />
                      Areas for Improvement
                    </Typography>
                    <List dense>
                      {analysisResult.improvements.map((improvement, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Warning color="warning" />
                          </ListItemIcon>
                          <ListItemText primary={improvement} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>

                {/* Suggestions */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Lightbulb color="info" sx={{ mr: 1 }} />
                      Suggestions
                    </Typography>
                    <List dense>
                      {analysisResult.suggestions.map((suggestion, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Lightbulb color="info" />
                          </ListItemIcon>
                          <ListItemText primary={suggestion} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>

                {/* Keywords */}
                {analysisResult.keywords && (
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Recommended Keywords to Include
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {analysisResult.keywords.map((keyword, index) => (
                          <Chip
                            key={index}
                            label={keyword}
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                )}

                {/* AI Questions */}
                {questions && (
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Personalized Interview Questions
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        Based on your CV and target role: {jobRole}
                      </Typography>

                      {questions.questions.map((q, index) => (
                        <Box key={index} sx={{ mb: 3 }}>
                          <Typography variant="subtitle2">
                            {index + 1}. {q.question}
                          </Typography>
                          <Chip
                            label={q.type}
                            size="small"
                            sx={{ mt: 0.5, mb: 1 }}
                            color={
                              q.type === "technical"
                                ? "primary"
                                : q.type === "behavioral"
                                ? "secondary"
                                : "default"
                            }
                          />
                          <Typography variant="body2" color="text.secondary">
                            <strong>Tips:</strong> {q.tips}
                          </Typography>
                          {index < questions.questions.length - 1 && (
                            <Divider sx={{ mt: 2 }} />
                          )}
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CVReview;
