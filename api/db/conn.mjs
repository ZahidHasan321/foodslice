import { MongoClient } from "mongodb";

const uri = process.env.DB_URL || "";

const client = new MongoClient(uri);

console.log(process.env.DB_URL)

let conn;

try {
// Connect the client to the server
    conn = await client.connect();

} 
    catch(e){
    console.error(e);
}

//connect to the database
let  db = conn.db("sample_training");

export default db;
