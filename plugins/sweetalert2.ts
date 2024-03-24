import Swal from 'sweetalert2'

const Toast =  Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1300,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('swal', Swal)
  nuxtApp.provide('toast', Toast)
})