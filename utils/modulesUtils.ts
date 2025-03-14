import { useNuxtApp } from '#app';
import type { ModuleData } from '~/types/ModuleData';

export function getModuleFromUserStorePreference() {
  const { $pinia } = useNuxtApp();
  const userStore = useUserStore($pinia);

  userStore.loadUserFromCookies();
  const layoutOrder: ModuleData[] = [];
  if (userStore.parameters?.modulesLayout) {
    userStore.parameters.modulesLayout.forEach((module, index) => {
      const position = index === 0 ? 'topLeft' : index === 1 ? 'topRight' : index === 2 ? 'bottomLeft' : 'bottomRight';
      switch (module) {
        case 'calendar':
          layoutOrder.push({
            position,
            module: '<CalendarModule @contextmenu.prevent="showContextMenu" />',
          });
          break;
        case 'markdown':
          layoutOrder.push({
            position,
            module: `<EditorMarkdown
                    :note-id="noteId"
                    :title-note="noteTitle"
                    :content-note="noteContent"
                    @open-markdown-center="handleMarkdownCenterOpening"
                  />`,
          });
          break;
        case 'passwordManager':
          layoutOrder.push({
            position,
            module: `<PasswordManager
            @contextmenu.prevent="showContextMenu"
            @open-password-center="handlePasswordCenterOpening"
          />`,
          });
          break;
        case 'drive':
          layoutOrder.push({
            position,
            module: `<DriveModule @contextmenu.prevent="showContextMenu" />`,
          });
          break;
        default:
          break;
      }
    });
  }
  return layoutOrder;
}
