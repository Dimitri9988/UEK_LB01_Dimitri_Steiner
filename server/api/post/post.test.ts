import { Post } from '../post/post';
import * as jwt from 'jsonwebtoken';

// Mocking jwt and database for testing
jest.mock('jsonwebtoken');
jest.mock('../../database/database', () => ({
  Database: jest.fn().mockImplementation(() => ({
    executeSQL: jest.fn(),
  })),
}));

describe('Post', () => {  
  let post: Post;  

  beforeEach(() => {
    post = new Post();  
  });

  describe('getPost', () => {  
    it('should retrieve posts from the database', async () => {
      // Mock the executeSQL method
      (post.database.executeSQL as jest.Mock).mockResolvedValue([
        { user_id: 1, username: 'testUser', tweet_id: 1, post_like: 0, content: 'Test post' },
      ]);

      const result = await post.getPost();  

      expect(post.database.executeSQL).toHaveBeenCalledWith(expect.stringContaining('SELECT users.id AS user_id'));
      expect(result).toEqual([
        { user_id: 1, username: 'testUser', tweet_id: 1, post_like: 0, content: 'Test post' },
      ]);
    });
  });

  describe('savePost', () => {
    it('should save a post to the database', async () => {
      // Mock the decode method
      (jwt.decode as jest.Mock).mockReturnValue({ username: 'testUser' });

      // Mock the executeSQL method
      (post.database.executeSQL as jest.Mock).mockResolvedValue([{ id: 1 }]);

      await post.savePost('Test post', 'mockedToken');

      expect(jwt.decode).toHaveBeenCalledWith('mockedToken');
      expect(post.database.executeSQL).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO tweets'));
    });
  });

  describe('deletePost', () => {
    it('should delete a post from the database', async () => {
      // Mock the executeSQL method
      (post.database.executeSQL as jest.Mock).mockResolvedValue([{ id: 1 }]);

      await post.deletePost('1');

      // Ensure that executeSQL was called for both deleteComment and deletePost
      expect(post.database.executeSQL).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM comment'));
      expect(post.database.executeSQL).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM tweets'));
    });
  });

  describe('likePost', () => {
    it('should increment post_like for a post in the database', async () => {
      // Mock the executeSQL method
      (post.database.executeSQL as jest.Mock).mockResolvedValue([{ id: 1 }]);

      await post.likePost('1');

      expect(post.database.executeSQL).toHaveBeenCalledWith(expect.stringContaining('UPDATE tweets SET post_like = post_like + 1'));
    });
  });

  describe('dislikePost', () => {
    it('should decrement post_like for a post in the database', async () => {
      // Mock the executeSQL method
      (post.database.executeSQL as jest.Mock).mockResolvedValue([{ id: 1 }]);

      await post.dislikePost('1');

      expect(post.database.executeSQL).toHaveBeenCalledWith(expect.stringContaining('UPDATE tweets SET post_like = post_like - 1'));
    });
  });
});
