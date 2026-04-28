"use client";

import { MessageParser } from "@/app/components/message-parser/core/Parser.core";
import { useEffect, useState } from "react";

export default function HowToUsePage() {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/data/How.to.use.md")
      .then((r) => r.text())
      .then(setContent);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:px-8 lg:px-12">
        <MessageParser content={content} />
      </div>
    </div>
  );
}
