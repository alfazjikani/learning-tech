$(document).ready(function() {
    if(mode === 'create') {
        $('#first_name, #family_name').change(function() {
            var firstName = $('#first_name').val().trim();
            var familyName = $('#family_name').val().trim();

            if(firstName && familyName) {
                var userId = firstName.substr(0, 1)
                    + familyName;
                $('#user_id').val(userId.toLowerCase());
            }
        });
    }
});