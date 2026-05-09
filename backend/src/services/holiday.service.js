const axios = require("axios");

const isHoliday = async (date) => {
  const d = new Date(date);
  const day = d.getDay();

  // Check if weekend (0 = Sunday, 6 = Saturday)
  if (day === 0 || day === 6) {
    return { holiday: true, reason: "Weekend" };
  }

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const dayOfMonth = d.getDate();

  try {
    const response = await axios.get("https://calendarific.com/api/v2/holidays", {
      params: {
        api_key: process.env.CALENDARIFIC_API_KEY,
        country: "IN",
        year: year,
        month: month,
        day: dayOfMonth
      }
    });

    const holidays = response.data.response.holidays;
    if (holidays && holidays.length > 0) {
      return { holiday: true, reason: holidays[0].name };
    }
  } catch (error) {
    console.error("Calendarific API error:", error.message);
    // If API fails, we might want to skip holiday check or throw error
    // For now, let's assume no holiday if API fails to avoid blocking submissions
  }

  return { holiday: false };
};

module.exports = { isHoliday };
