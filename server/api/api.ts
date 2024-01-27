import { Request, Response, Express } from 'express';
import { Database } from '../database/database';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser'
import { Permission } from './permissions/rolePermissionCheck'; 
import { Post } from './post/post'

// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET;

export class API {
  // Properties
  app: Express
  database: Database
  post: Post

  // Constructor
  constructor(app: Express) {
    this.app = app
    this.database = new Database();
    this.post = new Post();

    this.app.post('/login', this.checkUser);
    this.app.post('/register', this.registerUser);
    this.app.post('/permission', this.adminCheck);
    this.app.post('/createPost', this.newPost);
    this.app.delete('/deletePost', this.deletePost);
    this.app.get('/getPost', this.getAllPost)
    this.app.post('/like', this.postLike)
  }


 
  // Methods
  private adminCheck(req: Request, res: Response) {
    bodyParser.json()(req, res, async () => {
      const { jwtToken } = req.body;

      const permission = new Permission(jwtToken);  
      
      const permissionUser = await permission.checkRolePermissions('testbutton');
      

      res.status(200).json({ permission: permissionUser });
    });
  }
  private postLike = (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      const { postId } = req.body;
      console.log(postId)
      this.post.likePost(postId);
    });
  }


  private deletePost = (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      const { postId } = req.body;
      console.log(postId)
      this.post.deletePost(postId);
    });
  }


  private newPost = (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      const { postMessage, jwtToken } = req.body;
      this.post.savePost(postMessage, jwtToken);
    });
  }

  private registerUser = (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      const { username, password, email } = req.body;
  
      console.log('Registrierungsdaten erhalten:');
      console.log('Benutzername:', username);
      console.log('Passwort:', password);
      console.log('E-Mail:', email);

      await this.database.executeSQL(
        `INSERT INTO users (username, password, email, role) VALUES ("${username}", "${password}", "${email}", "User")`
      );

    });
  }

  private getAllPost = async (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      try {
        const allpost = await this.post.getPost();
        res.status(200).json({ allpost });
      } catch (error) {
        console.error('Fehler beim Abrufen aller Posts', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  }


  private checkUser = (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      const { LoginPassword, LoginUsername } = req.body;
  
      console.log('Benutzerüberprüfung für:', LoginUsername);
  
      // Hier überprüfen Sie, ob der Benutzer in der Datenbank existiert
      const userExists = await this.database.executeSQL(
        `SELECT * FROM users WHERE username = "${LoginUsername}" AND password = "${LoginPassword}"`
      );
  
      if (userExists.length > 0) {
        const token = jwt.sign({ username: LoginUsername }, process.env.TOKEN_SECRET || '', { expiresIn: '30m' });
        res.status(200).json({ token: token });
      } else {
        res.status(404).send('Benutzer nicht gefunden');
      }
    });
  }
}
