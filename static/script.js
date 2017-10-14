$(document).ready(function() {
  console.log('linked');

  $('.modal').modal(); //MODAL initialization

  let newUserForm = $('.myForm')[0];
  $(newUserForm).hide();

  let addUserButton = $('#add-user-button');
  $(addUserButton).click(function(event) {
    event.preventDefault();
    $(newUserForm).slideDown(1000);
  });

  let cancelButton = $('#cancel-button');
  $(cancelButton).click(function(event) {
    event.preventDefault();
    $(newUserForm).slideUp(1000);

  });


});
