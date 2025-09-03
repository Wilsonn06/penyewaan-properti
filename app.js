const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/catalog', require('./services/catalog'));
app.use('/review', require('./services/review'));
app.use('/wishlist', require('./services/wishlist'));
app.use('/search', require('./services/search'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
