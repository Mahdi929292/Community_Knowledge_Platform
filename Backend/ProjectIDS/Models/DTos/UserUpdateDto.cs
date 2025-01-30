namespace ProjectIDS.Models.DTos
{
    public class UserUpdateDto
    {
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; }
        public int ReputationPoints { get; set; }
    }

}
