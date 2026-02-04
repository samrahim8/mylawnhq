"use client";

interface LawnTip {
  category: "mowing" | "watering" | "fertilizing" | "pest";
  title: string;
  description: string;
  priority: "info" | "warning" | "action";
}

const defaultTips: LawnTip[] = [
  {
    category: "mowing",
    title: "Mowing Height",
    description: "Keep grass at proper height for your type",
    priority: "info",
  },
  {
    category: "watering",
    title: "Watering Schedule",
    description: "Deep, infrequent watering is best",
    priority: "warning",
  },
  {
    category: "fertilizing",
    title: "Fertilization",
    description: "Follow seasonal feeding schedule",
    priority: "action",
  },
  {
    category: "pest",
    title: "Pest Control",
    description: "Monitor for early signs of problems",
    priority: "info",
  },
];

export default function LawnTips() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "action":
        return "bg-[#c17f59]";
      case "warning":
        return "bg-[#c17f59]";
      default:
        return "bg-[#7a8b6e]";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#e5e5e5] shadow-sm p-6">
      <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4">Lawn Tips</h3>
      <div className="space-y-4">
        {defaultTips.map((tip, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={`w-2 h-2 rounded-full mt-2 ${getPriorityColor(tip.priority)}`} />
            <div>
              <p className="text-[#1a1a1a] font-medium">{tip.title}</p>
              <p className="text-sm text-[#a3a3a3]">{tip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
