import React, { useState, useEffect } from 'react'
import axios from "axios";

import { Button, TextField, Container, Box, Typography } from "@mui/material"

import { LOG } from "./utils/loggingMiddleware";

const App = () => {
  const [url, setUrl] = useState("");
  const [shortUrls, setShortUrls] = useState([]);
  const [stats, setStats] = useState([]);

  const shortenUrl = async () => {
    try {
      const res = await axios.post("http://localhost:5000/shorten", { longUrl: url })
      setShortUrls([...shortUrls, res.data]);
    } catch (error) {
      await LOG("frontend", "error", "page", `shorten failed ${error.message}`)
    }
  }

  const loadStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/stats")
      setStats(res.data);
      await LOG("frontend", "error", "page", "stats loading succesfull")
    }
    catch (error) {
      await LOG("frontend", "error", "page", "stats loading fail")
    }
  }

  useEffect(() => {
    loadStats();
  }, [])
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>
      <Box display="flex" gap={2}>
        <TextField
          label="Enter Url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={shortenUrl}>
          Shorten
        </Button>
      </Box>

      <Box mt={4}>
        <Typography variant="h6">Generated Url:</Typography>
        {shortUrls.map((s, i) => (
          <div key={i}>
            <a href={s.shortUrl} target="_blank" rel="noreferrer">
              {s.shortUrl}
            </a>{" "}
            (expires: {new Date(s.expiry).toLocaleString()})
          </div>
        ))}
      </Box>

      <Box mt={4}>
        <Typography variant="h6">Stats:</Typography>
        {stats.map((s, i) => (
          <div key={i}>
            {s.code} : {s.longUrl}, clicks: {s.clicks},
            expires: {new Date(s.expiry).toLocaleString()}
          </div>
        ))}
      </Box>
    </Container>
  );
}

export default App