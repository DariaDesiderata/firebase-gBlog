const $blogPost = $('.blog')
$('.slider').slider()
//add blogs to the main page
function addBlogs(posts) {
  posts.forEach(post => {
    $blogPost.append(
      `<article id="${post.id}" class="blog-post z-depth-4 grid-element-wrap-col s6 m5 l10">
        <h3>${post.post_title}</h3>
         <h5>Post by: ${post.author_name}</h5>
         <p class="overflow-ellipsis">${post.body}</p>
         <a href='/blogPage.html?id=${post.id}'><p class="read-more">Read more</p></a>
       </article>`
    )
  })
}
$(function(){
    $('.caption').fadeIn(5000)
  })


$.get("https://gblog-dc.herokuapp.com/posts")
.then(addBlogs)
.catch(err => {
  console.log(err)
})
