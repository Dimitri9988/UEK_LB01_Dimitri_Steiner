import { Database } from '../../database/database';
import * as jwt from 'jsonwebtoken';

export class Post {
    database: Database

    constructor() {
        this.database = new Database();
    }

    public savePost = async (message: string, token: any) => {
        const decodedToken = jwt.decode(token);
        const username = decodedToken.username;

        const userId = await this.database.executeSQL(`SELECT id From users WHERE username = "${username}"`);
        await this.database.executeSQL(
            `INSERT INTO tweets (user_id, content) VALUES (${userId[0].id}, "${message}")`
        )
          
    }

    public getPost = async () => {
        const postDatas = await this.database.executeSQL(
            `SELECT users.id AS user_id, users.username as username, tweets.id AS tweet_id, tweets.content FROM users JOIN tweets ON users.id = tweets.user_id;`
        )
        const postoutput = postDatas
        //console.log(postoutput)
        return postoutput
    }

}