"use client";

import { useEffect, useMemo, useState } from "react";

export function useTypewriter({
  words,
  typingSpeed = 90,
  deletingSpeed = 45,
  pauseMs = 1300
}) {
  const safeWords = useMemo(() => (words.length ? words : [""]), [words]);
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = safeWords[wordIndex % safeWords.length];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          const nextText = currentWord.slice(0, text.length + 1);
          setText(nextText);
          if (nextText === currentWord) {
            setIsDeleting(true);
          }
        } else {
          const nextText = currentWord.slice(0, text.length - 1);
          setText(nextText);
          if (!nextText) {
            setIsDeleting(false);
            setWordIndex((prev) => prev + 1);
          }
        }
      },
      isDeleting ? deletingSpeed : text === currentWord ? pauseMs : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [deletingSpeed, isDeleting, pauseMs, safeWords, text, typingSpeed, wordIndex]);

  return text;
}
