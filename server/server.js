const app = require('./app');
const { PORT } = require('./config');

const server = app.listen(PORT);
console.info(`Listening to http://localhost:${PORT} 🚀`);
