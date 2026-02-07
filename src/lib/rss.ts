import Parser from 'rss-parser';

export interface BlogPost {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
}

export async function getLatestPosts(
  feedUrl: string,
  count: number = 3
): Promise<BlogPost[]> {
  try {
    const parser = new Parser();
    const feed = await parser.parseURL(feedUrl);
    return feed.items.slice(0, count).map((item) => ({
      title: item.title || '',
      link: item.link || '',
      pubDate: item.pubDate || '',
      contentSnippet: item.contentSnippet?.substring(0, 150) || '',
    }));
  } catch (error) {
    console.warn(`RSS fetch failed for ${feedUrl}:`, error);
    return [];
  }
}
