
export const convertTemperature = (temp: number, unit: 'C' | 'F') => {
  if (unit === 'F') {
    return (temp * 9/5) + 32;
  }
  return temp;
};

export const getTemperatureStatus = (temp: number) => {
  // Use Celsius thresholds regardless of display unit
  if (temp < 24) return { status: 'cold', color: 'temp-cold', label: 'Too Cold' };
  if (temp > 28) return { status: 'hot', color: 'temp-hot', label: 'Too Hot' };
  return { status: 'good', color: 'temp-good', label: 'Optimal' };
};
