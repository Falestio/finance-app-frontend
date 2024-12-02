export default defineNuxtRouteMiddleware((to, from) => {
  const jwtCookie = useCookie('jwt')

  console.log("auth middleware")
  console.log(jwtCookie.value)

  if(!jwtCookie.value){
    return navigateTo("/masuk")
  }
});
