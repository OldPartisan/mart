import { absoluteUrl } from "./utils";

/**
 * Абсолютный URL изображения для Open Graph.
 * Учитывает basePath статической сборки и не допускает /mart/mart.
 */
export function absoluteImage(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const site = new URL(absoluteUrl("/"));
  if (path.startsWith(site.pathname.replace(/\/$/, ""))) {
    return `${site.origin}${path}`;
  }
  const basePath = site.pathname.replace(/\/$/, "");
  return `${site.origin}${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
