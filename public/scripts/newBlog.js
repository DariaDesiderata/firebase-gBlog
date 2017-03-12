$('.add-new').click(() => {
  event.preventDefault()
  const newPost = {
    author: $('#author_name').val(),
    body: $('#body').val(),
    title: $('#post_title').val()
  }

  $.ajax("https://gblog-dc.herokuapp.com/posts", {
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(newPost)
  })
  .then(result => {
    if(result == "Post Successful") {
      window.location.href = "https://gblog-firebase.firebaseapp.com/index.html"
    }
  })
  .catch(err => console.log(err))
})
