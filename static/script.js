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

  let comment = document.getElementsByClassName('comments');
  console.log(comment);
  $(comment).click(function() {
    let postID = $(this).attr('id');

    let post = document.getElementsByClassName(`${postID}`)[0];

    let chosenPostModal = document.getElementById('chosen-post');
    chosenPostModal.innerHTML = post.innerHTML;



    // console.log(post.innerHTML);

    let postComment = document.getElementById('comment-form');
    $(postComment).attr('action', `/users/${postID}/comments`);
    console.log(postComment);

    // alert($(this).attr('id'));
  });

});
