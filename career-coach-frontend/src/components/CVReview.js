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
} from "@mui/material";
import {
  Upload as UploadIcon,
  Description as CVIcon,
} from "@mui/icons-material";

const CVReview = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setUploadProgress(0);

    // Simulate upload process
    const interval = setInterval(() => {
      setUploadProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(oldProgress + 10, 100);
      });
    }, 200);

    // Simulate API call
    setTimeout(() => {
      clearInterval(interval);
      setAnalysisResult({
        score: 85,
        strengths: ["Good education format", "Relevant skills listed"],
        improvements: [
          "Add more quantifiable achievements",
          "Improve formatting",
        ],
        suggestions: [
          "Convert S.S.C. to Secondary School Certificate",
          "Add more industry-specific keywords",
        ],
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <Box sx={{ py: 8, bgcolor: "background.default", minHeight: "100vh" }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 6, textAlign: "center" }}>
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
            Upload your CV for AI-powered analysis and improvement suggestions
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Upload Your CV
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Supported formats: DOC, DOCX, PDF. Get tailored feedback for
                Bangladeshi job market.
              </Typography>

              <Box
                sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}
              >
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadIcon />}
                >
                  Choose File
                  <input
                    type="file"
                    hidden
                    accept=".doc,.docx,.pdf"
                    onChange={handleFileChange}
                  />
                </Button>
                {selectedFile && (
                  <Typography variant="body2">{selectedFile.name}</Typography>
                )}
              </Box>

              {selectedFile && (
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? "Analyzing..." : "Analyze CV"}
                </Button>
              )}

              {loading && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                  />
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, display: "block" }}
                  >
                    Uploading: {uploadProgress}%
                  </Typography>
                </Box>
              )}
            </Box>

            {analysisResult && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Analysis Results
                </Typography>
                <Alert severity="info" sx={{ mb: 3 }}>
                  Overall Score: <strong>{analysisResult.score}%</strong>
                </Alert>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, bgcolor: "success.light" }}>
                      <Typography variant="subtitle2" gutterBottom>
                        ✅ Strengths
                      </Typography>
                      <ul>
                        {analysisResult.strengths.map((strength, index) => (
                          <li key={index}>
                            <Typography variant="body2">{strength}</Typography>
                          </li>
                        ))}
                      </ul>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, bgcolor: "warning.light" }}>
                      <Typography variant="subtitle2" gutterBottom>
                        📝 Improvements Needed
                      </Typography>
                      <ul>
                        {analysisResult.improvements.map(
                          (improvement, index) => (
                            <li key={index}>
                              <Typography variant="body2">
                                {improvement}
                              </Typography>
                            </li>
                          )
                        )}
                      </ul>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper sx={{ p: 3, bgcolor: "info.light" }}>
                      <Typography variant="subtitle2" gutterBottom>
                        💡 Suggestions
                      </Typography>
                      <ul>
                        {analysisResult.suggestions.map((suggestion, index) => (
                          <li key={index}>
                            <Typography variant="body2">
                              {suggestion}
                            </Typography>
                          </li>
                        ))}
                      </ul>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default CVReview;
