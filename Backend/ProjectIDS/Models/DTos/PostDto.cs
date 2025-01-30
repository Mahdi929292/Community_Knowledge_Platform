namespace ProjectIDS.Models.DTos
{
    public class PostDto
    {
        public int PostID { get; set; }
        public int UserID { get; set; }
        public string Title { get; set; }
        public int Votes { get; set; }
        public string Description { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int CategoryID { get; set; }
        public ICollection<CommentDto>? Comments { get; set; }
    }
}
