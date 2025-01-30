namespace ProjectIDS.Models
{
    public class Post
    {
        public int PostID { get; set; }
        public int UserID { get; set; }
        public string Title { get; set; }
        public int Votes {  get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int CategoryID { get; set; }

        public User User { get; set; }
        public Category Category { get; set; }
        public ICollection<Comment> Comments { get; set; } 
    }
}
