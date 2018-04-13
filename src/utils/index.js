import colors from '../constants/colors';

export const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

export const getRandomKey = () => +new Date() + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);

export const params = window.location.search ?
    window.location.search.replace('?','')
    .split('&')
    .reduce((p,e) => {
      const a = e.split('=');
      p[ decodeURIComponent(a[0]) ] = decodeURIComponent(a[1]);
      return p;
    },
    {}
  ) : {};