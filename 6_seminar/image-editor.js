const visibleCanvas = document.querySelector('#visible-canvas');

const filePicker = document.querySelector('#file-picker');
filePicker.addEventListener('change', (event) => {
    console.log(filePicker.value);
    console.log(filePicker.files);

    const file = filePicker.files[0];
    
    const reader = new FileReader();

    reader.addEventListener('load', (event) => {
        // console.log(event.target.result);
    });
    reader.readAsDataURL(file);
});