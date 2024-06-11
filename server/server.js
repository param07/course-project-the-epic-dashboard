const fs = require('fs');
const express = require('express');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { MongoClient } = require('mongodb');
const fetch = require('node-fetch');

let db; // Variable that points to the real DB.
const GraphQLDate = new GraphQLScalarType({
  name: 'GraphQLDate',
  description: 'A Date() type in GraphQL as a scalar',
  serialize(value) {
    return value.toISOString();
  },
  parseValue(value) {
    console.log(value)
    const dateValue = new Date(value);
    return isNaN(dateValue) ? undefined : dateValue;
  },
  parseLiteral(ast) {
    if (ast.kind == Kind.STRING) {
      const value = new Date(ast.value);
      return isNaN(value) ? undefined : value;
    }
  },
});

async function listoldmovies(parent, args, context, info) {
  console.log('display old top rated movies');
  const old = await db.collection('old_top_rated').find({ year: { $lt: 2005 } }).toArray();
  return old;
}

async function genremovies(parent, args, context, info) {
  console.log('display old top rated movies based on genre');
  const { genre } = args;
  const old = await db.collection('old_top_rated').find({ genre: { $all: genre } }).toArray();
  return old;
}
async function addPost(_, {post})
{	
  console.log("Adding post", post);
  const result = await db.collection('review').insertOne(post);
  return result.insertedCount==1;

}
async function getpost(parent, args, context, info) {
  console.log('get movie posts or reviews');
  const { movieId } = args;
  const posts = await db.collection('review').find({ movieId: { $eq: movieId } }).toArray();
  return posts;
}

//new code 
//Resolver2: Mutation
async function addUser(_, {userDetails})
{	
	console.log("Creating New User", userDetails);

  const countersColl = await db.listCollections({ name: 'counters' }).next();
  console.log("Checking if counters exists ", countersColl);
  if (!countersColl) {
    await db.createCollection('counters');
    await db.collection('counters').insertOne({ _id: 'fixedindex', current: 0 });
  }
  
	async function getNextSequence(name) {
	  const result = await db.collection('counters').findOneAndUpdate(
	    { _id: name },//find the entry that matches this _id
	    { $inc: { current: 1 } }, //perform the update
	    { returnDocument: 'after' },//do not return the old value, only updated counter value.
	  );
    console.log("getNextSequence result value: ", result);
	  return result.value.current;
	}
  const sameUserName = await db.collection('users').find({ username: { $regex: `^${userDetails.username}$`, $options: 'i' } });
  const count = await sameUserName.count();
  console.log(count);
  if(count==0){
    userDetails.id = await getNextSequence('fixedindex');
    const retResult = await db.collection('users').insertOne(userDetails);
    const savedUser = await db.collection('users').findOne({_id: retResult.insertedId});
    console.log("created user ",savedUser);
    return savedUser.id>0;
  }else{
    return false;
  }
	
}

async function getUser(_, {loginDetails}){
  var retVar = { id: 0, username: "" }
  console.log("username ",loginDetails.username);
  console.log("password ",loginDetails.password);
  const user = await db.collection('users').findOne({ username: { $regex: `^${loginDetails.username}$`, $options: 'i' },password: loginDetails.password });
  console.log("getUser ",user);
  if (user!=null) {
    retVar = { id: user.id, username: user.username }
  }
  console.log("getUser return variable ",user);
  return retVar;
}



const resolvers = {
  Query: {
    listoldmovies,
    genremovies,
    getpost,
    getUser,
  },
  Mutation: {
    addPost,
    addUser,
  },
  GraphQLDate,
};

const app = express();
app.use(express.static('public'));

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/travellerschema.graphql', 'utf-8'),
  resolvers,
  formatError: (error) => {
    console.log(error);
    return error;
  },
});
server.applyMiddleware({ app, path: '/graphql' });

async function connectToDb() {
  const url = 'mongodb://localhost/project';
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  console.log('Connected to Ticket To Ride MongoDB at', url);
  db = client.db();
}

async function insertMoviesIntoDb() {
  const url = 'https://imdb-top-100-movies.p.rapidapi.com/';
  const options = {
    method: 'GET',
    headers: {
      'content-type': 'application/octet-stream',
      /*Please use any of the below Keys to populate the database initially in your local mongodb. */
      //'X-RapidAPI-Key': 'd0b6fd1788msh2f167744f0463fap1b1035jsn8876ed0dd60a',
      'X-RapidAPI-Key': 'b6174df041msh032ad440f20175ap1663c0jsn47caef2dc30d',
      'X-RapidAPI-Host': 'imdb-top-100-movies.p.rapidapi.com',
    },
  };

  try {
    const response = await fetch(url, options);
    const movies = await response.json();

    const collection = db.collection('old_top_rated');
    const count = await collection.countDocuments();
    if (count === 0) {
      await collection.insertMany(movies);
      console.log('Inserted movies into the database');
    } else {
      console.log('The old_top_rated collection already contains data.');
    }

    //await db.collection('old_top_rated').insertMany(movies);
    //console.log('Inserted movies into the database');
  } catch (error) {
    console.error(error);
  }
}

(async function () {
  try {
    await connectToDb();
    //Uncomment this part once you want to load data by calling api
    const collection = db.collection('old_top_rated');
    const count = await collection.countDocuments();
    if (count === 0) {
      await insertMoviesIntoDb();
    } else {
      console.log('The old_top_rated collection already exists and contains data.');
    }
    //await insertMoviesIntoDb();
    app.listen(8000, function () {
      console.log('App started on port 8000');
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
})();
