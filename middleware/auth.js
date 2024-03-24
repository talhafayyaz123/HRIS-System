export default function ({ route, redirect }) {
  const publicPages = ['/login'];
  const authpage = !publicPages.includes(route.path);
  const loggeduser = localStorage.getItem('token');
  if (authpage && !loggeduser)
    return redirect('/login');
  
  redirect();
}
