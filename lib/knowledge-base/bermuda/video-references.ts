import { VideoReference } from "@/types";

export const BERMUDA_VIDEOS: VideoReference[] = [
  {
    id: "bv-lawn-transformation",
    topic: "Lawn Transformation",
    youtube_url: "https://www.youtube.com/watch?v=KUbIYAPb5xA",
    related_article_ids: ["bka-overview", "bka-fundamentals"],
  },
  {
    id: "bv-seed-basics",
    topic: "Bermuda Seed Basics",
    youtube_url: "https://www.youtube.com/watch?v=B1yUzHYbyZU",
    related_article_ids: ["bka-seeding", "bka-fundamentals"],
  },
  {
    id: "bv-overseeding",
    topic: "Over-seeding Bermuda",
    youtube_url: "https://www.youtube.com/watch?v=7GqwoSSAnPc",
    related_article_ids: ["bka-seeding"],
  },
  {
    id: "bv-bare-spots",
    topic: "Fixing Bare Spots (Stealing Runners)",
    youtube_url: "https://www.youtube.com/watch?v=dPeIIfYrZoE",
    related_article_ids: ["bka-growth", "bka-seeding"],
  },
  {
    id: "bv-scalp-marks",
    topic: "Scalp Marks Explained",
    youtube_url: "https://www.youtube.com/watch?v=l493elKIHnI",
    related_article_ids: ["bka-mowing", "bka-scalping"],
  },
  {
    id: "bv-lawn-leveling",
    topic: "Lawn Leveling",
    youtube_url: "https://www.youtube.com/watch?v=aQ0hmssW6eM",
    related_article_ids: ["bka-leveling"],
  },
  {
    id: "bv-nutsedge",
    topic: "Nutsedge Treatment",
    youtube_url: "https://www.youtube.com/watch?v=fwg0jGZlikI",
    related_article_ids: ["bka-weed-killing"],
  },
];

export function getVideosByArticle(articleId: string): VideoReference[] {
  return BERMUDA_VIDEOS.filter((v) =>
    v.related_article_ids.includes(articleId)
  );
}
