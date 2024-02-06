import { Client, Databases } from 'appwrite';
import conf from "./conf/conf"


const client = new Client();

client
    .setEndpoint(conf.appwriteUrl)
    .setProject(conf.appwriteProjectId);

export const databases = new Databases(client);

export default client;