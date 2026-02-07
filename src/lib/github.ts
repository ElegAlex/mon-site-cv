export interface GitHubRepo {
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  pushed_at: string;
  html_url: string;
  topics: string[];
}

export async function getRepoStats(
  owner: string,
  repo: string
): Promise<GitHubRepo | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          ...(import.meta.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${import.meta.env.GITHUB_TOKEN}` }
            : {}),
        },
      }
    );
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}
