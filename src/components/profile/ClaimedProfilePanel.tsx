"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase";

type ClaimedContent = {
  about_me: string | null;
  personal_statement: string | null;
  official_website: string | null;
  campaign_website: string | null;
  facebook_url: string | null;
  x_url: string | null;
  youtube_url: string | null;
  updated_at: string;
};

type ApprovedMedia = {
  id: string;
  media_type: "headshot" | "photo" | "video";
  storage_bucket: string | null;
  storage_path: string | null;
  public_url: string | null;
  caption: string | null;
  credit: string | null;
};

function safeLink(value: string | null) {
  if (!value) return null;
  return value.startsWith("http://") || value.startsWith("https://")
    ? value
    : `https://${value}`;
}

export default function ClaimedProfilePanel({ profileId }: { profileId: string }) {
  const supabase = useMemo(() => createClient(), []);
  const [content, setContent] = useState<ClaimedContent | null>(null);
  const [media, setMedia] = useState<ApprovedMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadClaimedProfile() {
      const [contentResult, mediaResult] = await Promise.all([
        supabase
          .from("claimed_profile_content")
          .select(
            "about_me, personal_statement, official_website, campaign_website, facebook_url, x_url, youtube_url, updated_at"
          )
          .eq("profile_id", profileId)
          .eq("status", "approved")
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("profile_media")
          .select("id, media_type, storage_bucket, storage_path, public_url, caption, credit")
          .eq("profile_id", profileId)
          .eq("status", "approved")
          .order("updated_at", { ascending: false }),
      ]);

      if (!mounted) return;
      if (contentResult.data) {
        setContent(contentResult.data as ClaimedContent);
      }
      if (mediaResult.data) {
        setMedia(mediaResult.data as ApprovedMedia[]);
      }
      setLoading(false);
    }

    loadClaimedProfile();

    return () => {
      mounted = false;
    };
  }, [profileId, supabase]);

  const links = [
    ["Official website", safeLink(content?.official_website ?? null)],
    ["Campaign website", safeLink(content?.campaign_website ?? null)],
    ["Facebook", safeLink(content?.facebook_url ?? null)],
    ["X", safeLink(content?.x_url ?? null)],
    ["YouTube", safeLink(content?.youtube_url ?? null)],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));

  const visibleMedia = media.filter((item) => item.media_type !== "headshot");
  const hasContent =
    Boolean(content?.about_me) ||
    Boolean(content?.personal_statement) ||
    links.length > 0 ||
    visibleMedia.length > 0;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-blue-700">
              Submitted by claimed profile, reviewed by RepWatchr
            </p>
            <h2 className="mt-1 text-2xl font-black text-blue-950">
              From the candidate / official
            </h2>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-700">
            Separate from RepWatchr verified record
          </span>
        </div>

        {loading ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="h-24 animate-pulse rounded-xl bg-gray-100" />
            <div className="h-24 animate-pulse rounded-xl bg-gray-100" />
          </div>
        ) : hasContent ? (
          <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              {content?.about_me ? (
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wide text-gray-500">
                    About me
                  </h3>
                  <p className="mt-2 whitespace-pre-line text-sm font-semibold leading-7 text-gray-700">
                    {content.about_me}
                  </p>
                </div>
              ) : null}
              {content?.personal_statement ? (
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wide text-gray-500">
                    Public statement
                  </h3>
                  <p className="mt-2 whitespace-pre-line text-sm font-semibold leading-7 text-gray-700">
                    {content.personal_statement}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              {links.length ? (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <h3 className="text-sm font-black text-gray-950">
                    Official and campaign links
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {links.map(([label, href]) => (
                      <a
                        key={href}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-white px-3 py-2 text-xs font-black text-blue-700 shadow-sm transition hover:text-red-700"
                      >
                        {label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}

              {visibleMedia.length ? (
                <div className="grid gap-3">
                  {visibleMedia.map((item) => {
                    const storageUrl =
                      item.storage_path && item.storage_bucket
                        ? supabase.storage
                            .from(item.storage_bucket)
                            .getPublicUrl(item.storage_path).data.publicUrl
                        : null;
                    const mediaUrl = item.public_url ?? storageUrl;
                    if (!mediaUrl) return null;

                    return (
                      <article
                        key={item.id}
                        className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                      >
                        <p className="text-xs font-black uppercase tracking-wide text-gray-500">
                          Approved {item.media_type}
                        </p>
                        {item.media_type === "video" ? (
                          <a
                            href={mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex text-sm font-black text-blue-700 hover:text-red-700"
                          >
                            Open approved video
                          </a>
                        ) : (
                          <img
                            src={mediaUrl}
                            alt={item.caption ?? "Approved profile media"}
                            className="mt-3 aspect-video w-full rounded-lg object-cover"
                          />
                        )}
                        {item.caption ? (
                          <p className="mt-2 text-sm font-semibold leading-6 text-gray-700">
                            {item.caption}
                          </p>
                        ) : null}
                        {item.credit ? (
                          <p className="mt-1 text-xs font-bold text-gray-500">
                            Credit: {item.credit}
                          </p>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <p className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm font-semibold leading-6 text-gray-600">
            No claimed public statement has been approved yet.
          </p>
        )}
      </div>
    </section>
  );
}
