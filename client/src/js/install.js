const installButton = document.getElementById('buttonInstall');

// Logic for installing the PWA

// Event Listener for beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (event) => {
  window.deferredPrompt = event;

  installButton.classList.toggle('hidden', false);
});

// Event Listener for click event on installButton element
installButton.addEventListener('click', async () => {
  const promptEvent = window.deferredPrompt;

  if (!promptEvent) {
    return;
  }

  try {
    await promptEvent.prompt();
  } catch (err) {
    // Handle install error
    console.error('Error installing PWA:', err);
  }

  window.deferredPrompt = null;

  installButton.classList.toggle('hidden', true);
});

// Event listener for appinstalled event
window.addEventListener('appinstalled', (event) => {
  window.deferredPrompt = null;

  // Show a success message to the user
  alert('PWA installed successfully!');
});
