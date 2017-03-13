$(document).ready(() => {

  var urlArr = window.location.href.split('=')
  var id = urlArr[urlArr.length-1]
  var url = "https://gblog-dc.herokuapp.com/posts/"+ id


  function parseBlog(post) {
    var date = (post.post_date).slice(0,10)
    $('.blog').append(
    `<article id="${post.id}" class="blog-article grid-element-wrap-col s6 m5 l10">
      <h4 class='post-title'>${post.post_title}</h4>
       <h5 class='author'>Post by: ${post.author_name}</h6>
       <h6 class='date'>Create date: ${date}</h6>
       <p class='body'>${post.body}</p>
    </article>`
  )}

//function called in $getComment later
  function appendComment(comment) {
    if (Number(id) === comment.post_id) {
      $('.comments-area').append(
        `<article id="${comment.id}" class="blog-comment z-depth-3 grid-element-wrap-col s6 m5 l10">
           <h6 class='author'>${comment.author_name}</h6>
           <p class='body'>${comment.comment_body}</p>
           <button data-target="modal1" data-id="${comment.id}" class="edit deep-purple lighten-2 btn">Edit comment</button>
             <div id="modal${comment.id}" class="modal">
                <div class="modal-content">
                  <form>
                    <div class="row">
                      <div class="input-field">
                        <input class="comment-author" id="${comment.user_id}" type="text" value="${comment.author_name}">
                        <label class="active" for="author"></label>
                      </div>
                      <div class="input-field">
                        <textarea class="body" type="text">${comment.comment_body}</textarea>
                      </div>
                      <div>
                        <a href="/blogPage.html?id=${comment.post_id}" data-id="${comment.id}" class="modal-action modal-close modal-save waves-effect btn-flat">Save</a>
                        <a href="/blogPage.html?id=${comment.post_id}" class="modal-action modal-close modal-cancel waves-effect btn-flat">Cancel</a>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
           <a class="delete-comment waves-effect waves-light red lighten-2 btn">Delete comment</a>
        </article>`)
      $('.comment-form').hide()
      $('.comment-form')[0].reset()
    }
  }

  //click event to activate comment modal
  $(document).on('click', '.edit', function() {
   var id = $(this).data('id')
    $('.modal').modal({
      opacity: 0.7
    })
    $('#modal'+ id).modal('open')
  })
  //click event to edit and submit comment modal
  $(document).on('click', '.modal-save', function(event) {
    event.preventDefault()
    var id = $(this).data('id')
    var url = "https://gblog-dc.herokuapp.com/comments/"+id
    var editedComment = {}
    console.log(id, url)

    editedComment.author_name = $('.comment-author').val(),
    editedComment.comment_body = $('textarea.body').val(),
    editedComment.user_id = $('.comment-author').attr('id')

    $.ajax(url, {
      method: "PUT",
      contentType: "application/json",
      data: JSON.stringify(editedComment)
    })
    .then(() => {window.location.reload()})
  })
  //click-event to activate edit post modal
  $(document).on('click', '.edit-blog', function() {
    var id = $(this).data('id')
    $('.modal').modal()
    $('#modal'+ id).modal('open')
  })
  //function called in $get request to create post edit form
  function editPost(post) {
    $('.edit-blog').attr('data-id', post.id)
    $('.edit-blog').click(function() {
      $('.blog-article').append(
          `<div id="modal${id}" class="modal">
             <div class="modal-content">
               <form>
                 <div class="row">
                   <div class="input-field">
                     <input class="post-title" type="text" value="${post.post_title}">
                     <label class="active" for="title"></label>
                   </div>
                   <div class="input-field">
                     <input class="post-author" type="text"value="${post.author_name}"disabled>
                     <label class="active" for="author"></label>
                   </div>
                   <div class="input-field">
                     <textarea class="body" type="text">${post.body}</textarea>
                   </div>
                   <div>
                     <a href="/blogPage.html?id=${post.id}" data-id="${post.id}" class="modal-action modal-close modal-save-post waves-effect btn-flat"><input type="submit"></a>
                     <a href="/blogPage.html?id=${post.id}" class="modal-action modal-close modal-cancel waves-effect btn-flat">Cancel</a>
                   </div>
                 </div>
               </form>
             </div>
           </div>`
      )
    })
  }
  //click-event to edit post and submit it
  $(document).on('click', '.modal-save-post', function(event) {
    event.preventDefault()
    var id = $(this).data('id')
    var editUrl = 'https://gblog-dc.herokuapp.com/posts/'+id
    //create new post object
    var editedPost = {}

    editedPost.id = id,
    editedPost.author_name = $('.post-author').val(),
    editedPost.body = $('textarea.body').val(),
    editedPost.post_title = $('input.post-title').val()

    $.ajax(editUrl, {
      method: "PUT",
      contentType: "application/json",
      data: JSON.stringify(editedPost)
    })
    .then(function(result) {
      console.log(result);
      window.location.reload()
    })
  })
  //add comment to a blog post
  function addComment() {
    $('.comment-blog').click(() => {
      $('.comment-form').toggle()
    })
    //create a new post Object and make an ajax call
    $('.comment-form').submit(function(event) {
      event.preventDefault()
      const newComment = {
        author: $('#author_name').val(),
        body: $('#body').val(),
        post_id: id
      }
      const url = "https://gblog-dc.herokuapp.com/comments/"+id

      $.ajax(url, {
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(newComment)
      })
      //append new comment to a post
      .then(newCommentArr => {
        var newComment = newCommentArr[0]
        appendComment(newComment)
        deleteComment(newComment)
      })
    })
  }

  //delete post by id
  function deletePost() {
    $('.delete').click(function(event) {
      event.preventDefault()
      var deleteUrl = 'https://gblog-dc.herokuapp.com/posts/'+ id
      console.log(deleteUrl);
      confirm("Are you sure you want to delete this post?")
      $.ajax(deleteUrl, {
        method: "DELETE"
      })
      .then(function() {window.location.href = "/index.html"})
    })
  }
  //delete comment by id
  function deleteComment() {
    $('.delete-comment').click(function(event) {
      event.preventDefault()
      var commentID = $(this).parent().attr('id')
      var deleteUrl = 'https://gblog-dc.herokuapp.com/comments/delete/'+ commentID
      confirm("Are you sure you want to delete this comment?")
      $.ajax(deleteUrl, {
      method: "DELETE"
      })
      .then(function() {window.location.reload()})
    })
  }

  $.get(url)
    .then(function(data) {
      parseBlog(data)
      editPost(data)
      deletePost()
      addComment()
    })
    .catch(err => {
      console.log(err)
    })

  $.get("https://gblog-dc.herokuapp.com/comments")
    .then(comments => {
      comments.forEach(comment => {
      appendComment(comment)
      })
    })
    .then(deleteComment)
})
