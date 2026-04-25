"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

interface Comment {
  id: string;
  content: string;
  display_name: string;
  county: string;
  created_at: string;
  user_id: string;
}

interface CommentSectionProps {
  officialId: string;
  officialName: string;
}

export default function CommentSection({
  officialId,
  officialName,
}: CommentSectionProps) {
  const { user, profile, roles } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();
  const isVerifiedProfile = Boolean(profile?.verified);
  const isClaimedOfficial = roles.includes("claimed_official");
  const isJournalist = roles.includes("journalist");
  const authorTier = isClaimedOfficial
    ? "Verified official / claimed profile"
    : isVerifiedProfile
      ? "Verified resident / parent"
      : isJournalist
        ? "Journalist profile"
        : "Signed-in anonymous profile";
  const authorRank = isClaimedOfficial ? 100 : isVerifiedProfile ? 80 : isJournalist ? 70 : 30;

  useEffect(() => {
    async function loadComments() {
      const { data } = await supabase
        .from("comments")
        .select("id, content, display_name, county, created_at, user_id")
        .eq("official_id", officialId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (data) {
        setComments(data);
      }
      setLoading(false);
    }

    loadComments();
  }, [officialId, supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    const trimmed = newComment.trim();
    if (!trimmed) return;
    if (trimmed.length > 2000) {
      setError("Comment must be under 2000 characters.");
      return;
    }

    const name = displayName.trim() || (profile?.county ? `${profile.county} Resident` : "Anonymous profile");

    setPosting(true);
    setError("");

    const { data, error: insertError } = await supabase
      .from("comments")
      .insert({
        user_id: user.id,
        official_id: officialId,
        content: trimmed,
        display_name: name,
        county: profile?.county ?? "Anonymous",
      })
      .select("id, content, display_name, county, created_at, user_id")
      .single();

    if (insertError) {
      setError(insertError.message);
      setPosting(false);
      return;
    }

    if (data) {
      setComments([data, ...comments]);
    }
    setNewComment("");
    setPosting(false);
  }

  async function handleDelete(commentId: string) {
    const { error: deleteError } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (!deleteError) {
      setComments(comments.filter((c) => c.id !== commentId));
    }
  }

  // Format dates as readable strings
  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Public Discussion
        </h2>
        <span className="text-sm text-gray-500">
          {comments.length} comment{comments.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <PolicyCard
          title="Constitutional speech stays visible"
          body="RepWatchr does not hide lawful viewpoint disagreement. Ranking can change, but lawful comments are not shadow banned because they are unpopular."
        />
        <PolicyCard
          title="Evidence gets preference"
          body="Verified officials, verified parents/residents, named journalists, public-source links, and direct answers rank above anonymous or unsourced comments."
        />
        <PolicyCard
          title="Illegal content is different"
          body="Threats, doxxing, spam, private student data, and unlawful harassment are moderation issues, not political disagreement."
        />
      </div>

      {/* Comment Form */}
      {!user ? (
        <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 p-6 text-center mb-6">
          <p className="text-gray-600 mb-3">
            Join the conversation about {officialName}
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/auth/login"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 grid gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs font-bold text-blue-950 sm:grid-cols-[1fr_auto] sm:items-center">
              <span>{authorTier}</span>
              <span>Ranking weight: {authorRank}/100</span>
            </div>
            <div className="mb-3">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={`Display name (default: ${profile?.county ? `${profile.county} Resident` : "Anonymous profile"})`}
                maxLength={50}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={`Ask a public question or leave a sourced concern for ${officialName}.`}
              rows={3}
              maxLength={2000}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {newComment.length}/2000
              </span>
              <button
                type="submit"
                disabled={posting || !newComment.trim()}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
              >
                {posting ? "Posting..." : "Post Question"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-xl bg-gray-100 p-5 h-24" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center">
          <p className="text-gray-500">
            No comments yet. Be the first to share your thoughts.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    {comment.display_name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {comment.display_name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{comment.county}</span>
                      <span>&#183;</span>
                      <span>{formatDate(comment.created_at)}</span>
                      <span>&#183;</span>
                      <span>{comment.county === "Anonymous" ? "Anonymous profile" : "Signed-in profile"}</span>
                    </div>
                  </div>
                </div>
                {user?.id === comment.user_id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete comment"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function PolicyCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-black text-gray-950">{title}</p>
      <p className="mt-1 text-xs font-semibold leading-5 text-gray-600">{body}</p>
    </div>
  );
}
