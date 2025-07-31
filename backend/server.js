// server

require('dotenv').config();

const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { createSuperAdmin } = require('./seed/seedAdmin');
const{PORT} = require('./constants') || 5000;

const server = http.createServer(app);

connectDB()
.then(() =>{
    console.log("Database Connected");
    createSuperAdmin();
    server.listen(PORT, ()=>{
        console.log(`server is running at http://localhost:${PORT}`);
    });
})
.catch((error) =>{
    console.error(`Failed to connect to MongoDB`);
    process.exit(1);
});
