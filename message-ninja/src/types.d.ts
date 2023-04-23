import { browser } from 'webextension-polyfill-ts';

declare global {
  const browser: typeof chrome;
}
