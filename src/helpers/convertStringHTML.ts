export const convertStringHTML = (htmlString: string | null) => {
  if (!htmlString) return "";
  let tempElement = document.createElement("div");
  tempElement.innerHTML = htmlString;
  // Get all HTML tags inside the temporary element
  let allTags = tempElement.querySelectorAll("*");
  // Extract content from each tag
  let tagContent: string | null = "";
  for (var i = 0; i < allTags.length; i++) {
    tagContent = tagContent + allTags[i].textContent;
  }
  return tagContent.trim();
};
