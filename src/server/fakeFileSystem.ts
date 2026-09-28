type Node =
  | { kind: "file" }
  | { kind: "folder"; content: Record<string, Node> };

const file = (): Node => ({ kind: "file" });
const folder = (content: Record<string, Node> = {}): Node => ({
  kind: "folder",
  content,
});

const sites: Record<string, Node> = {
  "uni-bamberg.example": folder({
    lectures: folder({
      isosysc: folder({
        "slides-week3.pdf": file(),
        "exercise-sheet-2.pdf": file(),
      }),
    }),
    library: folder({
      "opening-hours.html": file(),
      "study-rooms.pdf": file(),
    }),
  }),
  "faessla-kitchen.example": folder({
    menu: folder({ "schaeufele.html": file(), "beer-list.txt": file() }),
  }),
  "kumaran-portfolio.example": folder({
    "index.html": file(),
    projects: folder({
      zauberfit: folder({ "readme.md": file(), "demo.mp4": file() }),
    }),
  }),
};

export function findEntry(url: URL): "file" | "folder" | null {
  let node: Node | undefined = sites[url.hostname];
  const steps = url.pathname.split("/").filter((step) => step !== "");

  for (const step of steps) {
    if (!node || node.kind !== "folder") return null;
    node = node.content[decodeURIComponent(step)];
  }

  return node ? node.kind : null;
}
