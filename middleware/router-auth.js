export default function ({ app, route, redirect }) {
  const requiredPermissions = route.meta[0]?.permission
  if (requiredPermissions && !app.$myPrototype.can(requiredPermissions))
      return redirect('403')

  redirect();


}
