import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  IconButton,
  Alert,
  Divider,
  Rating,
} from "@mui/material";
import {
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Lightbulb as LightbulbIcon,
  Search as SearchIcon,
  FormatPaint as FormatPaintIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import fileParsingService from "../services/fileParsingService";
import geminiService from "../services/geminiService";
import { cvReviewAPI } from "./shared/api";

const StyledUploadArea = styled(Paper)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(3),
  textAlign: "center",
  cursor: "pointer",
  transition: "border-color 0.3s ease",
  "&:hover": {
    borderColor: theme.palette.primary.dark,
    backgroundColor: theme.palette.action.hover,
  },
}));

const AnalysisCard = styled(Paper)(({ theme, bgcolor }) => ({
  backgroundColor: bgcolor || theme.palette.background.default,
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
}));

const PriorityChip = styled(Chip)(({ priority }) => ({
  backgroundColor:
    priority === "high"
      ? "#f44336"
      : priority === "medium"
      ? "#ff9800"
      : "#4caf50",
  color: "white",
  fontSize: "0.75rem",
}));

const CVReviewPage = () => {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError("Please upload a PDF or DOCX file only.");
        toast.error("Please upload a PDF or DOCX file only.");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB.");
        toast.error("File size must be less than 10MB.");
        return;
      }

      setUploadedFile(file);
      setError("");
      toast.success("CV uploaded successfully!");
    }
  };

  const handleAnalyzeCV = async () => {
    if (!uploadedFile) {
      setError("Please upload your CV first.");
      toast.error("Please upload your CV first.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please provide a job description.");
      toast.error("Please provide a job description.");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setAnalysisResult(null);

    try {
      toast.info("Extracting text from your CV...");
      const extractedText = await fileParsingService.extractText(uploadedFile);

      const cleanedText = fileParsingService.cleanExtractedText(extractedText);
      const validation = fileParsingService.validateCVContent(cleanedText);

      if (!validation.isValid) {
        setError(validation.message);
        toast.error(validation.message);
        return;
      }

      toast.info("Analyzing your CV against the job description...");
      const analysis = await geminiService.analyzeCVAgainstJob(
        cleanedText,
        jobDescription.trim()
      );

      setAnalysisResult(analysis);
      toast.success("CV analysis completed successfully!");
    } catch (err) {
      console.error("CV analysis error:", err);
      const errorMessage =
        err.message || "Failed to analyze CV. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setAnalysisResult(null);
    setError("");
  };

  const handleCompleteCVReview = async () => {
    if (!analysisResult) {
      toast.error('No analysis result to save');
      return;
    }

    setIsSaving(true);
    try {
      const cvReviewData = {
        userId: JSON.parse(localStorage.getItem('user'))?.id || 'user123', // Get from auth context or fallback
        jobDescription,
        cvFileName: uploadedFile?.name,
        cvFilePath: uploadedFile?.name, // In real app, this would be the stored file path
        overallMatch: {
          score: analysisResult.overallMatch?.score || 0,
          summary: analysisResult.overallMatch?.summary || ''
        },
        strengths: analysisResult.strengths || [],
        weaknesses: analysisResult.weaknesses || [],
        missingSkills: analysisResult.missingSkills || [],
        recommendations: (analysisResult.recommendations || []).map(rec => ({
          category: rec.category || 'General',
          suggestion: rec.suggestion || rec,
          priority: rec.priority || 'medium'
        })),
        keywordOptimization: {
          missingKeywords: analysisResult.keywordOptimization?.missingKeywords || [],
          suggestions: analysisResult.keywordOptimization?.suggestions || ''
        },
        formatting: {
          score: analysisResult.formatting?.score || 0,
          suggestions: analysisResult.formatting?.suggestions || ''
        },
        suitability: {
          verdict: analysisResult.suitability?.verdict || 'Needs Assessment',
          reasoning: analysisResult.suitability?.reasoning || ''
        },
        status: 'COMPLETED'
      };

      await cvReviewAPI.saveCVReview(cvReviewData);
      toast.success('CV Review saved successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error saving CV review:', error);
      toast.error('Failed to save CV review. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case "Highly Suitable":
        return "success";
      case "Suitable":
        return "info";
      case "Needs Improvement":
        return "warning";
      default:
        return "error";
    }
  };

  const getVerdictIcon = (verdict) => {
    switch (verdict) {
      case "Highly Suitable":
        return <CheckCircleIcon />;
      case "Suitable":
        return <CheckCircleIcon />;
      case "Needs Improvement":
        return <WarningIcon />;
      default:
        return <ErrorIcon />;
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 4, bgcolor: "grey.50", minHeight: "100vh" }}
    >
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", color: "grey.900" }}
        >
          AI-Powered CV Review
        </Typography>
        <Typography variant="h6" color="grey.600">
          Upload your CV and get personalized feedback to improve your job
          application success rate.
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <IconButton size="small" onClick={() => setError("")}>
              <CancelIcon fontSize="small" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Column - Upload and Job Description */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={3} direction="column">
            {/* CV Upload Section */}
            <Grid item>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Upload Your CV
                  </Typography>

                  {!uploadedFile ? (
                    <>
                      <input
                        id="cv-upload"
                        type="file"
                        style={{ display: "none" }}
                        accept=".pdf,.docx,.doc"
                        onChange={handleFileUpload}
                      />
                      <label htmlFor="cv-upload">
                        <StyledUploadArea elevation={3}>
                          <UploadIcon
                            sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                          />
                          <Typography
                            variant="body1"
                            gutterBottom
                            sx={{ fontWeight: "medium" }}
                          >
                            Click to upload your CV
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            PDF or DOCX files up to 10MB
                          </Typography>
                        </StyledUploadArea>
                      </label>
                    </>
                  ) : (
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Box display="flex" alignItems="center">
                          <DescriptionIcon color="primary" sx={{ mr: 2 }} />
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {uploadedFile.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </Typography>
                          </Box>
                        </Box>
                        <IconButton onClick={removeFile} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Paper>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Job Description Section */}
            <Grid item>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Job Description
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here or describe the role you're applying for..."
                    variant="outlined"
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Provide a detailed job description to get more accurate
                    feedback.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Analyze Button */}
            <Grid item>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleAnalyzeCV}
                disabled={
                  isAnalyzing || !uploadedFile || !jobDescription.trim()
                }
                startIcon={
                  isAnalyzing ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
                sx={{
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: "medium",
                }}
              >
                {isAnalyzing ? "Analyzing CV..." : "Analyze My CV"}
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column - Results */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Analysis Results
              </Typography>

              {!analysisResult ? (
                <Box textAlign="center" py={6}>
                  <DescriptionIcon
                    sx={{ fontSize: 48, color: "grey.400", mb: 2 }}
                  />
                  <Typography variant="body1" color="text.secondary">
                    Upload your CV and provide a job description to get started.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ "& > *": { mb: 3 } }}>
                  {/* Overall Match Score */}
                  <AnalysisCard bgcolor="primary.50">
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Typography variant="h6">Overall Match</Typography>
                      <Typography
                        variant="h4"
                        color="primary.main"
                        fontWeight="bold"
                      >
                        {analysisResult.overallMatch?.score || 0}%
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      {analysisResult.overallMatch?.summary}
                    </Typography>
                  </AnalysisCard>

                  {/* Suitability Verdict */}
                  <AnalysisCard
                    bgcolor={
                      analysisResult.suitability?.verdict === "Highly Suitable"
                        ? "success.50"
                        : analysisResult.suitability?.verdict === "Suitable"
                        ? "info.50"
                        : analysisResult.suitability?.verdict ===
                          "Needs Improvement"
                        ? "warning.50"
                        : "error.50"
                    }
                  >
                    <Box display="flex" alignItems="center" mb={2}>
                      {getVerdictIcon(analysisResult.suitability?.verdict)}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        Suitability Assessment
                      </Typography>
                    </Box>
                    <Chip
                      label={analysisResult.suitability?.verdict || "Unknown"}
                      color={getVerdictColor(
                        analysisResult.suitability?.verdict
                      )}
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="body2">
                      {analysisResult.suitability?.reasoning}
                    </Typography>
                  </AnalysisCard>

                  {/* Strengths */}
                  {analysisResult.strengths &&
                    analysisResult.strengths.length > 0 && (
                      <AnalysisCard bgcolor="success.50">
                        <Box display="flex" alignItems="center" mb={2}>
                          <CheckCircleIcon color="success" />
                          <Typography variant="h6" sx={{ ml: 1 }}>
                            Strengths
                          </Typography>
                        </Box>
                        <List dense>
                          {analysisResult.strengths.map((strength, index) => (
                            <ListItem key={index}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <Typography color="success.main">•</Typography>
                              </ListItemIcon>
                              <ListItemText primary={strength} />
                            </ListItem>
                          ))}
                        </List>
                      </AnalysisCard>
                    )}

                  {/* Areas for Improvement */}
                  {analysisResult.weaknesses &&
                    analysisResult.weaknesses.length > 0 && (
                      <AnalysisCard bgcolor="warning.50">
                        <Box display="flex" alignItems="center" mb={2}>
                          <WarningIcon color="warning" />
                          <Typography variant="h6" sx={{ ml: 1 }}>
                            Areas for Improvement
                          </Typography>
                        </Box>
                        <List dense>
                          {analysisResult.weaknesses.map((weakness, index) => (
                            <ListItem key={index}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <Typography color="warning.main">•</Typography>
                              </ListItemIcon>
                              <ListItemText primary={weakness} />
                            </ListItem>
                          ))}
                        </List>
                      </AnalysisCard>
                    )}

                  {/* Missing Skills */}
                  {analysisResult.missingSkills &&
                    analysisResult.missingSkills.length > 0 && (
                      <AnalysisCard bgcolor="error.50">
                        <Box display="flex" alignItems="center" mb={2}>
                          <ErrorIcon color="error" />
                          <Typography variant="h6" sx={{ ml: 1 }}>
                            Missing Skills
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {analysisResult.missingSkills.map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill}
                              size="small"
                              color="error"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </AnalysisCard>
                    )}

                  {/* Recommendations */}
                  {analysisResult.recommendations &&
                    analysisResult.recommendations.length > 0 && (
                      <AnalysisCard bgcolor="info.50">
                        <Box display="flex" alignItems="center" mb={2}>
                          <LightbulbIcon color="info" />
                          <Typography variant="h6" sx={{ ml: 1 }}>
                            Recommendations
                          </Typography>
                        </Box>
                        {analysisResult.recommendations.map((rec, index) => (
                          <Box
                            key={index}
                            sx={{
                              mb: 2,
                              pl: 2,
                              borderLeft: 3,
                              borderColor: "info.main",
                            }}
                          >
                            <Box display="flex" alignItems="center" mb={1}>
                              <Typography
                                variant="subtitle2"
                                fontWeight="medium"
                              >
                                {rec.category}
                              </Typography>
                              <PriorityChip
                                label={`${rec.priority} priority`}
                                priority={rec.priority}
                                size="small"
                                sx={{ ml: 1 }}
                              />
                            </Box>
                            <Typography variant="body2">
                              {rec.suggestion}
                            </Typography>
                          </Box>
                        ))}
                      </AnalysisCard>
                    )}

                  {/* Keyword Optimization */}
                  {analysisResult.keywordOptimization && (
                    <AnalysisCard bgcolor="secondary.50">
                      <Box display="flex" alignItems="center" mb={2}>
                        <SearchIcon color="secondary" />
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          Keyword Optimization
                        </Typography>
                      </Box>
                      {analysisResult.keywordOptimization.missingKeywords &&
                        analysisResult.keywordOptimization.missingKeywords
                          .length > 0 && (
                          <Box mb={2}>
                            <Typography variant="subtitle2" gutterBottom>
                              Missing Keywords:
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {analysisResult.keywordOptimization.missingKeywords.map(
                                (keyword, index) => (
                                  <Chip
                                    key={index}
                                    label={keyword}
                                    size="small"
                                    color="secondary"
                                  />
                                )
                              )}
                            </Box>
                          </Box>
                        )}
                      <Typography variant="body2">
                        {analysisResult.keywordOptimization.suggestions}
                      </Typography>
                    </AnalysisCard>
                  )}

                  {/* Formatting Score */}
                  {analysisResult.formatting && (
                    <AnalysisCard bgcolor="grey.100">
                      <Box display="flex" alignItems="center" mb={2}>
                        <FormatPaintIcon />
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          Formatting Score
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Rating
                          value={analysisResult.formatting.score}
                          max={10}
                          readOnly
                        />
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          {analysisResult.formatting.score}/10
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {analysisResult.formatting.suggestions}
                      </Typography>
                    </AnalysisCard>
                  )}

                  {/* Complete CV Review Button */}
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      onClick={handleCompleteCVReview}
                      disabled={isSaving}
                      startIcon={
                        isSaving ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <SaveIcon />
                        )
                      }
                      sx={{
                        py: 2,
                        px: 4,
                        fontSize: "1.1rem",
                        fontWeight: "medium",
                        minWidth: 200
                      }}
                    >
                      {isSaving ? "Saving..." : "Complete CV Review"}
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CVReviewPage;
