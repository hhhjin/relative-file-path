export class RelativeFilePathError extends Error {
  name: "PathTypeError" | "NotFilePathError";
  constructor(name: "PathTypeError" | "NotFilePathError", message: string) {
    super(message);
    this.name = name;
  }
}

export function relativeFilePath(from: string, to: string) {
  if (
    (from[0] === "/" && to[0] !== "/") ||
    (from[0] !== "/" && to[0] === "/")
  ) {
    throw new RelativeFilePathError(
      "PathTypeError",
      "Both parameters must begin with '/' or not"
    );
  }

  if (from[from.length - 1] === "/" || to[to.length - 1] === "/") {
    throw new RelativeFilePathError(
      "NotFilePathError",
      "Both parameters must not end with '/'"
    );
  }

  const fromPath = from.split("/");
  const toPath = to.split("/");

  let i = 0;

  while (i < fromPath.length - 1) {
    if (toPath[i] === undefined || fromPath[i] !== toPath[i]) {
      break;
    }
    ++i;
  }

  const val = toPath.slice(i).join("/");

  if (i === fromPath.length - 1) {
    return "./" + val;
  }

  return "../".repeat(fromPath.length - 1 - i) + val;
}
