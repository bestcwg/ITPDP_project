
var serial_id = document.forms.form.serial_id;
var serial_id_error = document.getElementById('serial_id_error');
var serialids = ['scale43', 'andreasdum'];

function validated () {
    if (!(serialids.includes(serial_id.value))) {
        serial_id_error.style.display = "block";
        serial_id.value = '';
        return false;
    }
    else {
        serial_id_error.style.display = "none";
        return true;
    }
}

