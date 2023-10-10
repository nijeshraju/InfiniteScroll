const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 4001;

app.use(cors());
app.get('/api/photo-gallery-feed-page/page/:pageNumber', async (req, res) => {
  try {
    const pageNumber = req.params.pageNumber;
    const response = await axios.get(
      `https://englishapi.pinkvilla.com/app-api/v1/photo-gallery-feed-page/page/${pageNumber}`
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
