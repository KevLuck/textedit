import { Workbox } from 'workbox-window';
import SocialNetworkEditor from './editor';
import './database';
import '../css/style.css';

const main = document.querySelector('#main');
main.innerHTML = '';

const loadSpinner = () => {
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  spinner.innerHTML = `
    <div class="loading-container">
      <div class="loading-spinner" />
    </div>
  `;
  main.appendChild(spinner);
};

const editor = new SocialNetworkEditor();

if (typeof editor === 'undefined') {
  loadSpinner();
}

// Check if service workers are supported
if ('serviceWorker' in navigator) {
  // register workbox service worker
  const workboxSW = new Workbox('/src-sw.js');
  workboxSW.register();

  // Add a route to cache the thought content and user feed
  workboxSW.routing.registerRoute(
    /\/api\/thoughts|\/api\/feed/,
    new Workbox.strategies.CacheFirst({
      cacheName: 'social-network-cache',
    })
  );
} else {
  console.error('Service workers are not supported in this browser.');
}
