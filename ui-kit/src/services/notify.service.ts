import NotificationPanel from '@/components/notification/NotificationPanel.vue';
import { createApp } from 'vue';

function notify(
  text: string,
  type: 'danger' | 'success' = 'success',
  duration = 3000,
) {
  checkPanelExist();
  document.dispatchEvent(
    new CustomEvent('tnnc-add-notification', {
      detail: { text, type, duration },
    }),
  );
}

function mountPanel() {
  const container = document.createElement('div');
  container.id = 'tnnc-notify-container';
  document.body.appendChild(container);
  const app = createApp(NotificationPanel);
  app.mount('#tnnc-notify-container');
}

function checkPanelExist() {
  const panel = document.getElementById('tnnc-notify-container');
  if (panel) return;
  mountPanel();
}

export { notify };
