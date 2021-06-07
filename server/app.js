const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const { ApolloServer } = require('apollo-server-koa');
const { typeDefs, resolvers } = require('./graphql/schema');
const personRoutes = require('./routes/person');
const authRoutes = require('./routes/authentication');
const connectDB = require('./db');
connectDB();

const app = new Koa();
const apollo = new ApolloServer({ typeDefs, resolvers });
app.use(apollo.getMiddleware());

app.use(bodyParser());
app.use(personRoutes.routes());
app.use(authRoutes.routes());

module.exports = app;
