globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const originalError = console.error;
console.error = (...args) => {
  const message = args.map(String).join(' ');
  if (message.includes('react-test-renderer is deprecated')) {
    return;
  }
  originalError(...args);
};
