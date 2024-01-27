import { Post } from './post';


describe('Post class functions', () => {
    let post: Post;
  
    beforeEach(() => {
      // Set up a new instance of Post for each test
      post = new Post();
    });
  
    test('savePost should save a post successfully', async () => {
      const message = 'Test message';
      const token = 'mocked-token';
  
      const result = await post.savePost(message, token);
  
      expect(result).toBe(true);
      // Add more assertions if needed
    });
  
    test('getPost should return an array of posts', async () => {
      const result = await post.getPost();
  
      expect(Array.isArray(result)).toBe(true);
      // Add more assertions if needed
    });
  
    test('deletePost should delete a post successfully', async () => {
      const postId = 123;
  
      const result = await post.deletePost(postId);
  
      expect(result).toBe(true);
      // Add more assertions if needed
    });
  });