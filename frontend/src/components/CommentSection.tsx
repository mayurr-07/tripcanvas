import { MessageSquareText, Send } from "lucide-react";
import { useState } from "react";
import type { AuthUser, CommentThreadItem } from "../types/app";

interface CommentSectionProps {
  comments: CommentThreadItem[];
  currentUser: AuthUser;
  onAddComment: (message: string) => void;
}

export function CommentSection({ comments, currentUser, onAddComment }: CommentSectionProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    onAddComment(message.trim());
    setMessage("");
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50/80 p-5">
      <div className="flex items-center gap-3">
        <span className="rounded-xl bg-white p-3 text-[var(--accent)] shadow-sm">
          <MessageSquareText className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Comments</h3>
          <p className="text-sm text-slate-500">Keep feedback tied to the activity.</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-xl bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-semibold text-white">
                {comment.avatar}
              </div>
              <div>
                <p className="font-medium text-slate-950">{comment.author}</p>
                <p className="text-xs text-slate-400">{comment.createdAt}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{comment.message}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-sm font-semibold text-white">
          {currentUser.avatar}
        </div>
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Add a note for the team"
          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
        />
        <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
          <Send className="h-4 w-4" />
          Post
        </button>
      </form>
    </section>
  );
}