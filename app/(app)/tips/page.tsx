"use client";

import { useProfile } from "@/hooks/useProfile";
import { Scissors, Droplet, Sprout, Calendar, Lightbulb } from "lucide-react";

const tipsData = {
  bermuda: {
    mowing: {
      title: "Mowing Bermuda Grass",
      tips: [
        "Maintain height between 1-2 inches",
        "Mow frequently during peak growth (every 3-5 days)",
        "Use a reel mower for best results",
        "Never remove more than 1/3 of blade height",
        "Keep mower blades sharp to prevent tearing",
      ],
    },
    watering: {
      title: "Watering Bermuda Grass",
      tips: [
        "Water deeply (1-1.25 inches per week)",
        "Water early morning (before 10 AM)",
        "Reduce frequency in dormant season",
        "Let lawn dry between waterings",
        "Watch for signs of stress (bluish tint, footprints staying)",
      ],
    },
    fertilizing: {
      title: "Fertilizing Bermuda Grass",
      tips: [
        "Apply when lawn is actively growing (soil temp 65°F+)",
        "Use 1-1.5 lbs nitrogen per 1000 sq ft per application",
        "Fertilize every 4-6 weeks during growing season",
        "Avoid fertilizing dormant grass",
        "Water after application",
      ],
    },
    seasonal: {
      title: "Seasonal Care for Bermuda",
      tips: [
        "Spring: Scalp lawn low, apply pre-emergent, begin fertilization",
        "Summer: Maintain regular mowing and watering schedule",
        "Fall: Reduce fertilization, prepare for dormancy",
        "Winter: Lawn will brown - this is normal dormancy",
      ],
    },
  },
  zoysia: {
    mowing: {
      title: "Mowing Zoysia Grass",
      tips: [
        "Maintain height between 1-2.5 inches",
        "Mow less frequently than Bermuda (every 7-10 days)",
        "Use sharp blades - Zoysia is tough to cut",
        "A reel mower gives the best finish",
        "Bag clippings if thatch is an issue",
      ],
    },
    watering: {
      title: "Watering Zoysia Grass",
      tips: [
        "Water deeply (1 inch per week)",
        "Zoysia is more drought tolerant once established",
        "Reduce watering in fall to prepare for dormancy",
        "Morning watering is best",
        "Sandy soil may need more frequent watering",
      ],
    },
    fertilizing: {
      title: "Fertilizing Zoysia Grass",
      tips: [
        "Fertilize less than Bermuda (2-3 times per year)",
        "Apply in late spring after full green-up",
        "Use 0.5-1 lb nitrogen per 1000 sq ft",
        "Avoid over-fertilization (causes thatch)",
        "A fall application helps root development",
      ],
    },
    seasonal: {
      title: "Seasonal Care for Zoysia",
      tips: [
        "Spring: Wait for full green-up before fertilizing",
        "Summer: Zoysia handles heat well, maintain normal care",
        "Fall: Reduce fertilization, core aerate if needed",
        "Winter: Will go dormant - don't panic at brown color",
      ],
    },
  },
};

export default function TipsPage() {
  const { profile } = useProfile();
  const grassType = profile?.grassType || "bermuda";
  const tips = grassType === "zoysia" ? tipsData.zoysia : tipsData.bermuda;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Quick Tips</h1>
        <p className="text-neutral-600">
          Expert care guide for your{" "}
          <span className="text-neutral-900 capitalize">{grassType}</span> lawn
        </p>
      </div>

      <div className="grid gap-6">
        {Object.entries(tips).map(([key, section]) => (
          <div key={key} className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              {key === "mowing" && <Scissors size={20} strokeWidth={1.75} className="text-stone-500" />}
              {key === "watering" && <Droplet size={20} strokeWidth={1.75} className="text-stone-500" />}
              {key === "fertilizing" && <Sprout size={20} strokeWidth={1.75} className="text-stone-500" />}
              {key === "seasonal" && <Calendar size={20} strokeWidth={1.75} className="text-stone-500" />}
              {section.title}
            </h2>
            <ul className="space-y-3">
              {section.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-neutral-900 mt-2 flex-shrink-0" />
                  <span className="text-neutral-600">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* General Tips */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 mt-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <Lightbulb size={20} strokeWidth={1.75} className="text-stone-500" />
          General Best Practices
        </h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="w-2 h-2 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
            <span className="text-neutral-600">
              <strong className="text-neutral-900">Test your soil</strong> - Know your pH and nutrient levels before fertilizing
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-2 h-2 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
            <span className="text-neutral-600">
              <strong className="text-neutral-900">Core aerate annually</strong> - Reduces compaction and improves root growth
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-2 h-2 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
            <span className="text-neutral-600">
              <strong className="text-neutral-900">Apply pre-emergent</strong> - Prevent weeds before they start in early spring
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-2 h-2 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
            <span className="text-neutral-600">
              <strong className="text-neutral-900">Monitor for pests</strong> - Early detection prevents major damage
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
