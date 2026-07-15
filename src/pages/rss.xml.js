import rss from "@astrojs/rss";
import { SITE_TITLE, SITE_DESCRIPTION } from "@/consts";
import { getPublishedPosts } from "@/lib/blog";

export async function GET(context) {
  const posts = await getPublishedPosts();
  const site = new URL(import.meta.env.BASE_URL, context.site);

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site,
    items: posts.map((post) => ({
      ...post.data,
      link: `${import.meta.env.BASE_URL}blog/${post.id}/`,
    })),
  });
}
