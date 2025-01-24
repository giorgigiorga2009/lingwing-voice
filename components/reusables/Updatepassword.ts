import Swal from "sweetalert2"

const showAlert = (titleText: string, desc: string, isError: boolean, style: {[key: string]: string} ) => {
    const title = `<span style="font-family: Noto Sans Georgian SemiBold;">${titleText}</span>`
    const text = desc
      ? `<span style="font-family: Noto Sans Georgian SemiBold;">${desc}</span>`
      : ''
    return Swal.fire({
      title,
      html: text,
      icon: isError ? 'error' : 'success',
      showConfirmButton: true,
      confirmButtonColor: 'rgb(105 46 150)',
      confirmButtonText: 'OK',
      customClass: {
        popup: style.swalPopup
      }
    })
  }

  export default showAlert