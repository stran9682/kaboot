namespace backend.Models;

public class QuestionModel
{
    public string Question { get; set; } = String.Empty;
    public double Time { get; set; }
    public List<string> Answers { get; set; } = new();
    public int CorrectIndex { get; set; }
}