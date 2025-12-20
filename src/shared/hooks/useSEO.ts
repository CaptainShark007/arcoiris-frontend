import { useEffect, useRef } from "react";

export default function useSEO(title: string, description: string) {
  const prevTitle = useRef<string>(document.title);
  const prevDescription = useRef<string>("");

  useEffect(() => {
    const previousTitle = prevTitle.current;
    
    if (title) {
      document.title = `${title} | Arcoiris`;
    }
    
    return () => {
      document.title = previousTitle;
    };
  }, [title]);

  useEffect(() => {
    const metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]');

    if (metaDescription && description) {
      prevDescription.current = metaDescription.getAttribute('content') || "";
      metaDescription.setAttribute('content', description);
    }

    return () => {
      if (metaDescription && prevDescription.current) {
        metaDescription.setAttribute('content', prevDescription.current);
      }
    };
  }, [description]);
}