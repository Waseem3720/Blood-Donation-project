import api from './api';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const initPushSubscription = async () => {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Web Push is not supported by this browser.');
      return;
    }

    let permission = Notification.permission;

    if (permission === 'denied') {
      // Do not repeatedly ask if user previously denied permission
      return;
    }

    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }

    if (permission !== 'granted') {
      return;
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;

    // Fetch VAPID Public Key from backend
    const { data } = await api.get('/subscriptions/vapid-key');
    const vapidPublicKey = data?.publicKey;

    if (!vapidPublicKey) {
      console.warn('VAPID public key not retrieved from backend.');
      return;
    }

    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });
    }

    const subJson = subscription.toJSON();

    if (subJson.endpoint && subJson.keys) {
      await api.post('/subscriptions/subscribe', {
        endpoint: subJson.endpoint,
        keys: subJson.keys
      });
    }
  } catch (err) {
    console.error('Push Subscription initialization error:', err);
  }
};
