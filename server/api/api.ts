import { Request, Response, Express } from 'express';
import { Database } from '../database/database';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser'
import { permission } from './permissions/rolePermissionCheck'; 

// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET;

export class API {
  // Properties
  app: Express
  database: Database

  // Constructor
  constructor(app: Express) {
    this.app = app
    this.database = new Database();

    this.app.post('/login', this.checkUser);
    this.app.post('/register', this.registerUser);
    this.app.post('/permission', this.adminCheck);
    this.app.post('/createPost', this.newPost);
    
  }


 
  // Methods
  private adminCheck(req: Request, res: Response) {
    bodyParser.json()(req, res, async () => {
      const { jwtToken } = req.body;

      const permission = new permission(jwtToken);  
      
      const permissionUser = await permission.checkRolePermissions('testbutton');
      console.log('Is Admin:', permissionUser);

      res.status(200).json({ permission: permissionUser });
    });
  }




  private newPost = (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      const { postMessage } = req.body;
      console.log(postMessage)

      await this.database.executeSQL(
        `INSERT INTO tweets (user_id, content) VALUES (1, "${postMessage}")`
      )
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

  private checkUser = (req: Request, res: Response) => {
    bodyParser.json()(req, res, async () => {
      const { LoginPassword, LoginUsername } = req.body;

      console.log('Benutzerüberprüfung für:', LoginUsername);
      //console.log(require('crypto').randomBytes(64).toString('hex'))

      // Hier überprüfen Sie, ob der Benutzer in der Datenbank existiert
      const userExists = await this.database.executeSQL(
        `SELECT * FROM users WHERE username = "${LoginUsername}" AND password = "${LoginPassword}"`
      );

      if (userExists.length > 0) {
        const token = jwt.sign({ username: LoginUsername }, process.env.TOKEN_SECRET, { expiresIn: '30m' });
        //const decodedToken = jwt.decode(token);
        res.status(200).json({ token: token });
      } else {
        res.status(404).send('Benutzer nicht gefunden');
      }
    });
  }
}
