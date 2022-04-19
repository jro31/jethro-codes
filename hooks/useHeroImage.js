const useHeroImage = articlesArray => {
  let returnImage = '';

  articlesArray.map(article => {
    if (!returnImage && article.coverImage) returnImage = article.coverImage;
  });

  return returnImage;
};

export default useHeroImage;
