namespace ProjectIDS.Models.DTos
{
    public class CommentDto
    {
        public int CommentID { get; set; }
        public int PostID { get; set; }
        public int UserID { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
