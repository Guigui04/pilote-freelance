import { getIntegration } from "@/lib/integrations";

type NotionResult = { id: string; title: string; url: string };

/**
 * Recherche dans Notion via l'API officielle (jeton d'intégration interne).
 */
export async function searchNotion(userId: string, query: string): Promise<NotionResult[]> {
  const integ = await getIntegration(userId, "notion");
  const token = integ?.accessToken ?? process.env.NOTION_TOKEN;
  if (!token) return [];

  const res = await fetch("https://api.notion.com/v1/search", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, page_size: 15 }),
  });

  if (!res.ok) {
    console.error("[notion] search", res.status, await res.text());
    return [];
  }

  const data = await res.json();
  return (data.results ?? []).map((r: Record<string, unknown>) => {
    const props = (r.properties as Record<string, unknown>) ?? {};
    let title = "(sans titre)";
    for (const key of Object.keys(props)) {
      const p = props[key] as { type?: string; title?: { plain_text: string }[] };
      if (p?.type === "title" && p.title?.length) {
        title = p.title.map((t) => t.plain_text).join("");
        break;
      }
    }
    return { id: r.id as string, title, url: (r.url as string) ?? "" };
  });
}
