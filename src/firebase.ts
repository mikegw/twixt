import { initializeApp } from 'firebase/app';
import { Config } from "./index";

export const initializeFirebase = (config: Config) => {
  return initializeApp(config.firebaseConfig, config.environment)
}
