import ConfirmComponent from '@/components/ConfirmComponent.vue';
import { createApp, type App } from 'vue';

let container: HTMLElement | null = null;
let app: App<Element> | null = null;

async function confirm(text: string) {
  return new Promise((resolve, reject) => {
    function accept() {
      clearMemory();
      resolve(true);
    }
    function decline() {
      clearMemory();
      reject(false);
    }
    prepateShowing(text, accept, decline);
  });
}

function prepateShowing(text: string, accept: () => void, decline: () => void) {
  blurElements();
  container = document.createElement('div');
  if (container) {
    container.id = 'tnnc-confirm-container';
    document.body.appendChild(container);
    app = createApp(ConfirmComponent)
      .provide('text', text)
      .provide('accept', accept)
      .provide('decline', decline);
    app.mount('#tnnc-confirm-container');
  }
}

function clearMemory() {
  unBlurElements();
  if (app && container) {
    app.unmount();
    document.body.removeChild(container);
  }
}

function blurElements() {
  for (let i = 0; i < document.body.childElementCount; i++) {
    (document.body.children[i] as HTMLElement).style.transition = 'all 0.2s';
    (document.body.children[i] as HTMLElement).style.filter = 'blur(1px)';
  }
}

function unBlurElements() {
  for (let i = 0; i < document.body.childElementCount; i++) {
    (document.body.children[i] as HTMLElement).style.transition = '';
    (document.body.children[i] as HTMLElement).style.filter = '';
  }
}

export { confirm };
