import { Comment } from '../comment/comment';
import * as jwt from 'jsonwebtoken';

// Mocking jwt and database for testing
jest.mock('jsonwebtoken');
jest.mock('../../database/database', () => ({
  Database: jest.fn().mockImplementation(() => ({
    executeSQL: jest.fn(),
  })),
}));

describe('Comment', () => {  
  let comment: Comment;  

  beforeEach(() => {
    comment = new Comment();  
  });

  describe('getComment', () => {  
    it('should retrieve comments from the database', async () => {
      (comment.database.executeSQL as jest.Mock).mockResolvedValue([
        { user_id: 1, comment_id: 1, tweet_id: 1, username: 'testUser', comment_content: 'Test comment' },
      ]);

      const result = await comment.getComment();  

      expect(comment.database.executeSQL).toHaveBeenCalledWith(expect.stringContaining('SELECT users.id AS user_id'));
      expect(result).toEqual([
        { user_id: 1, comment_id: 1, tweet_id: 1, username: 'testUser', comment_content: 'Test comment' },
      ]);
    });
  });

  describe('saveComment', () => {
    it('should save a comment to the database', async () => {
      // Mock the decode method
      (jwt.decode as jest.Mock).mockReturnValue({ username: 'testUser' });

      // Mock the executeSQL method
      (comment.database.executeSQL as jest.Mock).mockResolvedValue([{ id: 1 }]);

      await comment.saveComment('Test comment', 'mockedToken', 1);

      expect(jwt.decode).toHaveBeenCalledWith('mockedToken');
      expect(comment.database.executeSQL).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO comment'));
    });

  });

  describe('deleteComment', () => {
    it('should delete a comment from the database', async () => {
      // Mock the executeSQL method
      (comment.database.executeSQL as jest.Mock).mockResolvedValue([{ id: 1 }]);

      await comment.deleteComment('1');

      expect(comment.database.executeSQL).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM tweets'));
    });
  });
});
