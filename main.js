pageToken = {};

$(document).ready(function() {
  $("#searchButton").click(function() {
    searchYoutube();
  });
  $(".tokenClass").click(function() {
    pageToken.current =
      $(this).val() == "Next" ? pageToken.nextPage : pageToken;
    searchYoutube();
  });
});

searchYoutube = () => {
  $.ajax({
    url: "https://www.googleapis.com/youtube/v3/search",
    dataType: "json",
    type: "GET",
    data: {
      key: "AIzaSyDKwrMrzoe49Po7216qjNV4881K6S6NAmQ",
      q: $("#search").val(),
      part: "id,snippet",
      id: "videoId",
      maxResults: 5,
      pageToken: pageToken.current
    },

    success: function(data) {
      $("#output").html("");
      
      function getTags(videoId) {
        return new Promise((resolve, reject) => {
          $.ajax({
            url: "https://www.googleapis.com/youtube/v3/videos",
            dataType: "json",
            type: "GET",
            data: {
              key: "AIzaSyDKwrMrzoe49Po7216qjNV4881K6S6NAmQ",
              part: "snippet",
              id: videoId
            },
            success: resolve
          });
        });
      }
      pageToken.nextPage = data.nextPageToken;

      if (data["pageInfo"]["totalResults"] === 0) {
        $(".no-match").show();
      } else {
        $.each(data["items"], function(index, value) {
          getTags(value.id.videoId).then(data => {
            var tags = data.items[0].snippet.tags;
            var html = "";
            html +=
              '<div><a href="https://www.youtube.com/watch?v=' +
              value.id.videoId +
              '" target="_blank"><img  class="thumbnail" src="' +
              value.snippet.thumbnails.medium.url +
              '"></a></div>';
            html += '<div><div class="title">' + value.snippet.title + "</div>";
            html += '<div class="ball"></div>';
            html +=
              '<div class="descrip">' + value.snippet.description + "</div>";
            html += '<div class="tag">' + tags.join(", ") + "</div>"; // <- This returns undefined
            console.log();
            $("#output").append(html);
          });
        });
      }
    },

    error: function() {
      $(".error-msg").show();
      $("#output").hide();
    }
  });
};

$(window).scroll(function() {
  if ($(this).scrollTop() > 1) {
    $("header").addClass("sticky");
  } else {
    $("header").removeClass("sticky");
  }
});
