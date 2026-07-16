"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const PHRASES = [
  "Scaling Organic Growth for Enterprise Brands",
  "Architecting Technical SEO That Compounds",
  "Turning Search Data Into Revenue",
];

export function TypewriterHeadline() {
  const reduced = useReducedMotion();
  const [text, setText] = useState(reduced ? PHRASES[0] : "");
  const [phrase, setPhrase] = useState(0);
  const [char, setChar] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced) {
      return;
    }
    const current = PHRASES[phrase % PHRASES.length];
    const timer = setTimeout(() => {
      if (!deleting && char < current.length) {
        setText(current.slice(0, char + 1));
        setChar((c) => c + 1);
      } else if (!deleting && char === current.length) {
        setTimeout(() => setDeleting(true), 1600);
      } else if (deleting && char > 0) {
        setText(current.slice(0, char - 1));
        setChar((c) => c - 1);
      } else if (deleting && char === 0) {
        setDeleting(false);
        setPhrase((p) => p + 1);
      }
    }, deleting ? 35 : 65);
    return () => clearTimeout(timer);
  }, [char, deleting, phrase, reduced]);

  return (
    <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
      {text}
      <span className="ml-1 inline-block w-[3px] animate-pulse-soft bg-growth align-middle" aria-hidden>
        &nbsp;
      </span>
    </h1>
  );
}
