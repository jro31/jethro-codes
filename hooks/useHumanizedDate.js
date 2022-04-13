const useHumanizedDate = () => {
  const daySuffix = numericDayInt => {
    if (numericDayInt >= 4 && numericDayInt <= 20) return 'th';

    switch (parseInt(String(numericDayInt).split('').slice(-1)[0])) {
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

  const day = date => {
    const numericDay = date.toLocaleDateString('en-GB', { day: 'numeric' });
    return `${numericDay}${daySuffix(parseInt(numericDay))}`;
  };

  const month = date => date.toLocaleDateString('en-GB', { month: 'short' });

  const year = date => date.toLocaleDateString('en-GB', { year: '2-digit' });

  const humanizedDate = date => {
    const parsedDate = new Date(date);
    return `${day(parsedDate)} ${month(parsedDate)} '${year(parsedDate)}`;
  };

  return humanizedDate;
};

export default useHumanizedDate;
