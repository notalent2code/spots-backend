// Function to check if two time slots overlap
function isOverlap(start1, end1, start2, end2) {
  return start1 < end2 && start2 < end1;
}

// Function to get the current date in unix timestamp
function convertDateToUnix(dateString) {
  const dateObject = new Date(dateString);
  const unixTimestamp = Math.floor(dateObject.getTime() / 1000);
  return unixTimestamp;
}

// Function to check if the new booking is feasible
function isFeasible(newDate, newStartHour, newEndHour, bookedDates) {
  for (let i = 0; i < bookedDates.length; i++) {
    const bookedDate = bookedDates[i];
    const bookedDateStr = bookedDate.date;
    const bookedStartHour = bookedDate.start_hour;
    const bookedEndHour = bookedDate.end_hour;

    const newDateUnix = convertDateToUnix(newDate);
    const currentDateUnix = parseInt(Date.now() / 1000);

    if (newDateUnix < currentDateUnix) {
      return false;
    }

    if (
      newDate === bookedDateStr &&
      isOverlap(newStartHour, newEndHour, bookedStartHour, bookedEndHour)
    ) {
      return false; // New booking overlaps with an existing booking on the same date
    }
  }

  return true; // New booking does not overlap with any existing booking on the same date
}

// Function to check if the new booking is valid
function isValidBooking(newDate, newStartHour, newEndHour, bookedDates) {
  if (
    newStartHour < 0 ||
    newStartHour >= 24 ||
    newEndHour < 0 ||
    newEndHour >= 24 ||
    newStartHour >= newEndHour
  ) {
    return false; // New booking has invalid start and/or end hour
  }

  return isFeasible(newDate, newStartHour, newEndHour, bookedDates);
}

module.exports = {
  isValidBooking,
  convertDateToUnix,
};
