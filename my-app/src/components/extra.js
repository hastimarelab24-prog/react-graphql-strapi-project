const getDescriptionText = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  if (!Array.isArray(value)) {
    return "";
  }

  const extractText = (children = []) =>
    children
      .map((child) => {
        if (typeof child === "string") return child;
        if (Array.isArray(child?.children)) {
          return extractText(child.children);
        }
        return child?.text || "";
      })
      .join("");

  return value
    .map((block) => {
      if (typeof block === "string") return block;
      return extractText(block?.children || []);
    })
    .filter(Boolean)
    .join(" ")
    .trim();
};

const descriptionText = getDescriptionText(description);