import { useEffect, useState } from "react";

// Parse the current hash into a route object: { path, segments, query }.
export function parseHash() {
  const raw = window.location.hash.replace(/^#/, "") || "/";
  const [pathPart, queryPart] = raw.split("?");
  const path = pathPart || "/";
  const segments = path.split("/").filter(Boolean);
  const query = new URLSearchParams(queryPart || "");
  return { path, segments, query };
}

export function useRoute() {
  const [route, setRoute] = useState(parseHash);

  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}

export function navigate(to, query) {
  let target = to.startsWith("#") ? to : `#${to}`;
  if (query) {
    const qs =
      typeof query === "string"
        ? query
        : new URLSearchParams(query).toString();
    target += (target.includes("?") ? "&" : "?") + qs;
  }
  if (window.location.hash === target) {
    // Same hash won't fire hashchange — force a refresh.
    window.dispatchEvent(new Event("hashchange"));
  } else {
    window.location.hash = target;
  }
}
