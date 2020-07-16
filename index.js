const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(path.resolve(__dirname, './client/build')));

app.get('/randomword', (req, res) => {
  res.status(200).json({ word: 'randomword' });
});

app.use('*', (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, './client/build/index.html'));
});
