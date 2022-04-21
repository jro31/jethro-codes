const useTagsArray = tagsString => {
  return tagsString ? tagsString.split(', ') : [];
};

export default useTagsArray;
