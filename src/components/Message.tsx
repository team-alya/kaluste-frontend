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
  return (
    <motion.div
      className={`flex flex-row md:gap-4 gap-3 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-5`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
        {role === "assistant" ? <BotIcon /> : <UserIcon />}
      </div>

      <div className="flex flex-col gap-6 w-full">
        <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4 tracking-tighter md:tracking-normal">
          <Markdown>{content as string}</Markdown>
        </div>
      </div>
    </motion.div>
  );
};
