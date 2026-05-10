import { Bot, Send } from "lucide-react";
import { useState } from "react";
import { aiService } from "../../services/aiService";
import Alert from "./Alert";
import Button from "./Button";
import Input from "./Input";

const suggestedQuestions = [
  "How many users currently have the viewer role?",
  "What are the names of the recently registered users?",
  "Show system overview totals",
  "Which products have low stock?",
];

const DataQueryAssistant = () => {
  const [question, setQuestion] = useState(suggestedQuestions[0]);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const askQuestion = async (event) => {
    event.preventDefault();
    setError("");
    setAnswer("");
    setIsLoading(true);

    try {
      const response = await aiService.ask(question);
      setAnswer(response.data.answer);
    } catch (exception) {
      setError(exception.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-brand">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-ink">AI Data Query</h2>
          <p className="mt-1 text-sm text-muted">Ask operational questions using the current database context.</p>
        </div>
      </div>

      <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={askQuestion}>
        <Input
          aria-label="Database question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask about users, roles, or products"
          required
        />
        <Button type="submit" disabled={isLoading} className="sm:w-auto">
          <Send className="h-4 w-4" />
          {isLoading ? "Asking..." : "Ask"}
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {suggestedQuestions.map((item) => (
          <button
            key={item}
            type="button"
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-brand"
            onClick={() => setQuestion(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        <Alert message={error} />
        {answer && <div className="rounded-md border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">{answer}</div>}
      </div>
    </section>
  );
};

export default DataQueryAssistant;
