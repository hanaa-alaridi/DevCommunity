"use client";

import { useState } from "react";
import { TopicSelectorProps } from "@/types/topics";

export default function TopicSelector({availableTopics, selectedTopics, onChange, maxTopics = 5,} : TopicSelectorProps) {
  const [customTopic, setCustomTopic] = useState("");
  function toggleTopic(topic: string) {
    if (selectedTopics.includes(topic)) {
      onChange(selectedTopics.filter((t) => t !== topic));
    } 
    else {
      if (selectedTopics.length >= maxTopics) return;
      onChange([...selectedTopics, topic]);
    }
  }
  function handleAddCustomTopic(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && customTopic.trim()) {
      e.preventDefault();
      const formatted = customTopic.trim();
      if (!selectedTopics.includes(formatted) && selectedTopics.length < maxTopics) {
        onChange([...selectedTopics, formatted]);
        setCustomTopic("");
      }
    }
  }
  const allTopics = Array.from(
    new Set([...availableTopics, ...selectedTopics])
  );
  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-zinc-300">
        Topics (Select or type up to {maxTopics})
      </label>
      <input type="text" value={customTopic} onChange={(e) => setCustomTopic(e.target.value)} onKeyDown={handleAddCustomTopic} placeholder="Type a custom topic and press Enter..." className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:border-brand focus:outline-none"/>
      <div className="flex flex-wrap gap-2">
        {allTopics.map((topic) => {
          const isSelected = selectedTopics.includes(topic);
          return (
            <button type="button" key={topic} onClick={() => toggleTopic(topic)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${isSelected ? "bg-brand text-black font-semibold border-brand" : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700"}`}>
              {topic} {isSelected ? "✓" : "+"}
            </button>
          );
        })}
      </div>
    </div>
  );
}