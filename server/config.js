const ENV = process.env.NODE_ENV;
const JWT_SECRET_KEY =
  process.env.JWT_SECRET_KEY || 'jwt.access.token-secret-afasfdaeg';

const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN || 'secret-refresh-token-access-fdskjfh';

// const dbName = ENV === 'test' ? 'persons-test' : 'persons-development';
// const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost:27017/`;

const MONGO_PORT = 27017;
const db_name = process.env.db_name || 'persons';
const dbName = db_name;
const MONGODB_URI = `mongodb://${process.env.db_service_name}:${MONGO_PORT}/${db_name}`;

const PORT = process.env.PORT || 3001;
const tokenLife = '15m'; // 15 min
const refreshTokenLife = '1d'; //24 hrs

module.exports = {
  tokenLife,
  refreshTokenLife,
  ENV,
  JWT_SECRET_KEY,
  MONGODB_URI,
  PORT,
  dbName,
  REFRESH_TOKEN_SECRET,
};
