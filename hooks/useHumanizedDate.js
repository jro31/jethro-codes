const useHumanizedDate = () => {
  const daySuffix = numericDay => {
    if (parseInt(numericDay) >= 4 && parseInt(numericDay) <= 20) return 'th';

    switch (parseInt(String(numericDay).split('').slice(-1)[0])) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  const humanizedDate = date => {
    const parsedDate = new Date(date);
    return `
      ${parsedDate.toLocaleDateString('en-GB', { day: 'numeric' })}${daySuffix(
      parsedDate.toLocaleDateString('en-GB', { day: 'numeric' })
    )} ${parsedDate.toLocaleDateString('en-GB', {
      month: 'short',
    })} '${parsedDate.toLocaleDateString('en-GB', { year: '2-digit' })}
    `;
  };

  return humanizedDate;
};

export default useHumanizedDate;
