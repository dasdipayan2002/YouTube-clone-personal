const API_KEY = "AIzaSyDTY8DYGvEg8MKjBuehlEzd5BzjRYESEno";

const BASE_URL = "https://www.googleapis.com/youtube/v3";
const channelList = "https://www.googleapis.com/youtube/v3/channels?";
const videoConatiner = document.querySelector(".right-sidebar");
const allComments = document.querySelector(".old-comment");
const details=document.querySelector(".details");
const addcmt=document.querySelector(".add-comment");
const searchInput=document.querySelector(".search-bar");
const searchBtn = document.querySelector(".serarch-btn");

function getVideoIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('videoId');
}

function renderVideoPlayer(videoId) {
  const videoPlayerContainer = document.getElementById('video-player');
  videoPlayerContainer.innerHTML = `
      <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `;
}

// Example usage
const videoId = getVideoIdFromUrl();
if (videoId) {
  renderVideoPlayer(videoId);
} else {
  document.getElementById('video-player').innerText = 'No video ID provided.';
}

// -------------------------fetching video details-------------

async function fetchVideoDetails(videoId) {
  try {
    const response = await fetch(`${BASE_URL}/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    const videoDetails = data.items[0];
    return {
      title: videoDetails.snippet.title,
      views: videoDetails.statistics.viewCount,
      likes: videoDetails.statistics.likeCount,
      dislikes: videoDetails.statistics.dislikeCount,
      channelId: videoDetails.snippet.channelId,
      channelName: videoDetails.snippet.channelTitle
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
  }
}

// Fetch channel details including subscriber count and description
async function fetchChannelDetails(channelId) {
  try {
    const response = await fetch(`${BASE_URL}/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    const channelDetails = data.items[0];
    return {
      subscriberCount: channelDetails.statistics.subscriberCount,
      description: channelDetails.snippet.description,
      imageUrl: channelDetails.snippet.thumbnails.default.url
    };
  } catch (error) {
    console.error('Error fetching channel details:', error);
  }
}


// Example usage
(async () => {
  // const videoId = 'YOUR_VIDEO_ID_HERE'; // Replace with the actual video ID
  const videoDetails = await fetchVideoDetails(videoId);
  if (videoDetails) {
    const channelDetails = await fetchChannelDetails(videoDetails.channelId);
    if (channelDetails) {
      const combinedDetails = {
        ...videoDetails,
        ...channelDetails
      };
      details.innerHTML=`

      <h3>${combinedDetails.title}</h3>
      <div class="play-video-info">
          <p>${combinedDetails.views} Views </p>
          <div>
              <a href=""><img src="images/like.png" alt="">${combinedDetails.likes}</a>
              <a href=""><img src="images/dislike.png" alt="">${combinedDetails.dislikes}</a>
              <a href=""><img src="images/share.png" alt="">Share</a>
              <a href=""><img src="images/save.png" alt="">Save</a>
          </div>
      </div>
      <hr>
      <div class="publisher">
          <img src="${combinedDetails.imageUrl}" alt="">
          <div>
              <p>${combinedDetails.channelName}</p>
              <span>${combinedDetails.subscriberCount} Subscriber</span>
          </div>
          <button>Subscribe</button>
      </div>
       `
       addcmt.innerHTML=`
       <img src="${combinedDetails.imageUrl}" alt="">
       <input type="text" name="" id="" placeholder="Write Comment">
       `
      console.log('Combined Video and Channel Details:', combinedDetails);

    }
  }
})();

// -------------------------fetching comments------------------

async function getComments(videoId, maxResults) {
  try {
    const response = await fetch(
      BASE_URL +
      "/commentThreads" +
      `?key=${API_KEY}` +
      `&videoId=${videoId}` +
      `&maxResults=${maxResults}&part=snippet`
    );
    const data = await response.json();
    console.log(data);
    for (let i = 0; i < maxResults; i++) {
      allComments.innerHTML += `
                 <div>
                  <img src="${data.items[i].snippet.topLevelComment.snippet.authorProfileImageUrl}" alt="">
                         <h3>${data.items[i].snippet.topLevelComment.snippet.authorDisplayName} <span>time</span></h3>
                             <p>${data.items[i].snippet.topLevelComment.snippet.textDisplay}</p>
                             <div class="comment-action">
                                 <img src="images/like.png" alt="">
                                 <span>${data.items[i].snippet.topLevelComment.snippet.likeCount}</span>
                                <img src="images/dislike.png" alt="">
                                <span>0</span>
                                <span>Reply</span>
                                <a href="">All Replies</a>
                                 
                             </div>
                  </div>
        `
    }

  } catch (e) {
    console.log(e);
  }
}
getComments(videoId, 7);

window.addEventListener("load", () => {
  //let videoId = "8b0ubLO2MUE";
  if (YT) {
    // this YT.player takes div id
    // & object which is having information
    // like width, height, videoId
    new YT.Player("video-player", {
      height: "500",
      width: "1000",
      videoId,
      events: {
        onReady: (e) => {
          e.target.playVideo();
        },
      },
    });
  }
});

// --------------------------------------Making Video list in player-----------

async function fetchVideos(searchQuery, maxResults) {
  try {
    const response = await fetch(
      BASE_URL +
      "/search" +
      `?key=${API_KEY}` +
      "&part=snippet" +
      `&q=${searchQuery}` +
      `&maxResults=${maxResults}`
    );
    const data = await response.json();
    //console.log(data.items);
    for (let i = 0; i < maxResults; i++) {
      getChannelIcon(data.items[i]);
    }
    // data.items.forEach(item => {
    //     getChannelIcon(item);
    // });
  } catch (e) {
    console.log(e);
  }
}
fetchVideos("", 20)

const getChannelIcon = (video_data) => {
  fetch(channelList + new URLSearchParams({
    key: API_KEY,
    part: 'snippet',
    id: video_data.snippet.channelId
  }))
    .then(res => res.json())
    .then(data => {
      video_data.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
      //console.log(video_data);
      makeVideoCard(video_data);
    })
}



const makeVideoCard = (data) => {
  const dur = fetchVideoStats(data.id.videoId, 'statistics');
  dur.then(function resolveDefi(duration) {
    console.log(duration);
    videoConatiner.innerHTML += `
          <div class="side-video-list">
                  <a href="play.html?videoId=${data.id.videoId}" class="small-thumbnails"><img src="${data.snippet.thumbnails.high.url}" alt=""></a>
                  <div class="vid-info">
                    <a href="play.html?videoId=${data.id.videoId}">${data.snippet.title}</a>
                    <p>${data.snippet.channelTitle}</p>
                    <p> ${duration} Views</p>
                  </div>

               </div> `
    //return data;
  })
}


async function fetchVideoStats(videoId, typeOfDetails) {
  try {
    const response = await fetch(
      BASE_URL +
      "/videos" +
      `?key=${API_KEY}` +
      `&part=${typeOfDetails}` +
      `&id=${videoId}`
    );
    const data = await response.json();
    //console.log(data.items[0].statistics.viewCount);
    return data.items[0].statistics.viewCount;
  } catch (e) {
    console.log(e);
  }
}

function work(){
  console.log('click',searchInput.value);
  videoConatiner.innerHTML="";
  fetchVideos(searchInput.value,50);
}