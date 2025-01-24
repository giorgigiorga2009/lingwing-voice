const addOneMonth = (dateString: string, removeHours?: boolean) => {
  const [datePart, timePart] = dateString.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);

  const date = new Date(year, month - 1, day, hours, minutes);

  date.setMonth(date.getMonth() + 1);

  const newYear = date.getFullYear();
  const newMonth = String(date.getMonth() + 1).padStart(2, '0');
  const newDay = String(date.getDate()).padStart(2, '0');
  const newHours = String(date.getHours()).padStart(2, '0');
  const newMinutes = String(date.getMinutes()).padStart(2, '0');

  if (removeHours) {
    return `${newYear}-${newMonth}-${newDay}`;
  } else {
    return `${newYear}-${newMonth}-${newDay} ${newHours}:${newMinutes}`;
  }
};

export default addOneMonth;
