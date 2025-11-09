import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");

export const connection  = async () => {
    try{
        await client.connect();
        return client.db("torneo");
    }catch(ex){
        console.log(ex);
    }
}