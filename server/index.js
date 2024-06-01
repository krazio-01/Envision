const express = require('express');
const cors = require('cors');
const tvShowRoutes = require('./routes/tvShowRoutes');
const movieRoutes = require('./routes/movieRoutes');
const multiRoutes = require('./routes/multiRoutes');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.use("/api/tv", tvShowRoutes);
app.use("/api/movie", movieRoutes);
app.use("/api/multi", multiRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
