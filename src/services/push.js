// gunakan ini di bagian saat user login atau click enable notifications
const VAPID_PUBLIC_KEY = 'REPLACE_WITH_PUBLIC_VAPID_KEY'; // <-- GANTI DENGAN VAPID KEY DARI DOKUMENTASI API

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export async function subscribeUserToPush() {
  if (!('serviceWorker' in navigator)) throw new Error('No service worker support');
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
  });
  // Kirim subscription ke server API Anda (POST /subscriptions atau endpoint yang disediakan)
  await fetch('/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sub)
  });
  return sub;
}

export async function unsubscribeUserFromPush() {
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  if (sub) {
    await sub.unsubscribe();
    // beri tahu server untuk menghapus subscription
    await fetch('/api/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: sub.endpoint })
    });
    return true;
  }
  return false;
}
