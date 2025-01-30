namespace ProjectIDS.Models.Dtos
{
    public class UserCreateDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; }
        public int ReputationPoints { get; set; }
    }
}
