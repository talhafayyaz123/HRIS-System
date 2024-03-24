import { useAuthStore } from '@/store/auth'
import { usePermissionStore } from '@/store/permission'

export default async function ({ app, route, redirect }) {
        const authStore = useAuthStore(app.$pinia)
        const permissionStore = usePermissionStore(app.$pinia)
      if (route.meta.public && !authStore.authenticated) {
        redirect();
        return;
      }
      if (JSON.parse(localStorage.getItem("authenticated")) || route.meta.public) {
        if (
          !permissionStore.permissionsGlobal?.length
        ) {
          try {
            await permissionStore.permissionsGlobal({
              limit_start: 0,
              limit_count: 1000,
            })
          } catch (e) {
          } finally {
            redirect();
          }
        } else {
          redirect();
        }
        return;
      }


  redirect();
}
