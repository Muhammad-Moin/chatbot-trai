const AppUtilities = {
  // Utility function for truncating text
  truncateText: (text, maxLength) =>
    text.length > maxLength ? `${text.slice(0, maxLength)}...` : text,

  // Debounce function to limit the rate of function execution
  debounce: (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  },
};

export default AppUtilities;
