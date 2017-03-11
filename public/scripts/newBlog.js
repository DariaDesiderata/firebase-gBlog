$('.add-new').click(() => {
  event.preventDefault()
  const newPost = {
    author: $('#author_name').val(),
    body: $('#body').val(),
    title: $('#post_title').val()
  }
  
  $.ajax("/posts", {
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(newPost)
  })
  .then(result => {
    if(result == "Post Successful") {
      window.location.href = "/index.html"
    }
  })
  .catch(err => console.log(err))
})
