var dict = {};
const VITE_PROTOCOL = import.meta.env.VITE_PROTOCOL;
const VITE_HOST = import.meta.env.VITE_HOST;
const VITE_PORT = import.meta.env.VITE_PORT;
const VITE_API_STRING = import.meta.env.VITE_API_STRING;
dict["VITE_PROTOCOL"] = VITE_PROTOCOL;
dict["VITE_HOST"] = VITE_HOST;
dict["VITE_PORT"] = VITE_PORT;
dict["VITE_API_STRING"] = VITE_API_STRING;

export const getEnv = (envVar) => {
  return dict[envVar];
};
