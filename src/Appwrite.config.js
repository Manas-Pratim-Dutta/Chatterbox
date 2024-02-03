import { Client } from 'appwrite';
import "./conf/conf"


const client = new Client();

client
    .setEndpoint(conf.appwriteUrl)
    .setProject(conf.appwriteProjectId);

    export default client;