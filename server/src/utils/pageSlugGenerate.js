const pageSlugGenerate = (name) => {
  // slugify the name
  const slug = name.toLowerCase().replace(/ /g, '-');

  return `${slug}`;
};

export default pageSlugGenerate;
