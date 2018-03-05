import colors from '../constants/colors';

export const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];