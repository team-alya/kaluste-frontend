"use client";

import { motion } from "framer-motion";
import { BotIcon, UserIcon } from "lucide-react";
import { ReactNode } from "react";
import { Markdown } from "./MarkDown";

export const Message = ({
  role,
  content,
}: {
  role: string;
  content: string | ReactNode;
}) => {
  const isUser = role === "user";

  return (
    <motion.div
      className={`flex ${isUser ? "flex-row-reverse" : "flex-row"} md:gap-4 gap-3 px-4 w-full md:px-0 first-of-type:pt-5`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div
        className={`size-[24px] flex flex-col justify-center items-center flex-shrink-0 ${
          isUser ? "text-blue-500" : "text-green-500"
        }`}
      >
        {isUser ? <UserIcon /> : <BotIcon />}
      </div>

      <div
        className={`flex flex-col gap-6 w-full p-4 rounded-lg shadow-sm ${
          isUser
            ? "bg-blue-50 border border-blue-100 md:max-w-[85%] ml-auto hover:bg-blue-50/80 transition-colors"
            : "bg-green-50 border border-green-100 md:max-w-[85%] hover:bg-green-50/80 transition-colors"
        }`}
      >
        <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4 tracking-tighter md:tracking-normal">
          <Markdown>{content as string}</Markdown>
        </div>
      </div>
    </motion.div>
  );
};
