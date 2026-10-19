const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')       // spaces/underscores -> hyphens
    .replace(/[^a-z0-9-]/g, '')    // remove non-alphanumeric (except hyphens)
    .replace(/--+/g, '-')          // collapse multiple hyphens
    .replace(/^-+|-+$/g, '');      // trim leading/trailing hyphens
};

module.exports = slugify;