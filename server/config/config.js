const env = process.env.NODE_ENV || "development";


if (env === "development") {
    process.env.MONGODB_URI = "mongodb://localhost:27017/VOTE_APP";
    process.env.NODE_ENV = 5000;
    process.env.JWT_SECRET = "SECRET";
} else  if (env === "test") {
    process.env.MONGODB_URI = "mongodb://localhost:27017/VOTE_APP_TEST";
    process.env.NODE_ENV = 5000;
    process.env.JWT_SECRET = "SECRET";    
}