const useReadingMinutes = () => {
  const wordCount = content => content.split(' ').length;

  const readingMinutes = articleContent => Math.ceil(wordCount(articleContent) / 200);

  return readingMinutes;
};

export default useReadingMinutes;
