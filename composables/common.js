import Swal from 'sweetalert2'

export default function commonCode(){
    const
        router = useRoute(),
        Toast =  Swal.mixin({
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
    const deleteAlert = (title='Are you sure?',text='You wont be able to revert this!', confirmButton = 'Yes, delete it!')=>{
            let swal_delete=''
            swal_delete = Swal.fire({
                title: title,
                text:text,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#FF0000',
                cancelButtonColor: '#ffaa00',
                confirmButtonText: confirmButton,
                cancelButtonText: 'Cancel'
            })
            return swal_delete;
        }

    // const disableIcon = (value) => isDisabled.value === value

    return {
        router, deleteAlert,  Toast
    }
}
