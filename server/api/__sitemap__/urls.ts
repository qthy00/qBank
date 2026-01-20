import type { SitemapUrlInput } from "#sitemap/types";

export default defineSitemapEventHandler(() => {

  // return keys.map((key: string) => {
  //   return {
  //     loc: `/t/${key}`,
  //     lastmod: new Date().toISOString(),
  //     changefreq: "weekly",
  //     priority: 0.8,
  //     _sitemap: "pages",
  //   };
  // }) satisfies SitemapUrlInput[];
  return [] satisfies SitemapUrlInput[];
});
