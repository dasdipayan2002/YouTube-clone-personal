let menuIcon=document.querySelector(".menu-icon");
let sidebar=document.querySelector(".sidebar");
let container=document.querySelector(".container");
const searchInput=document.querySelector(".search-bar");
const searchBtn = document.querySelector(".serarch-btn");

const  videoConatiner=document.querySelector(".list-container");



const API_KEY = "AIzaSyCGbIA4g2XOwBxshP1ZB40psGe6jjQObNI";

const BASE_URL = "https://www.googleapis.com/youtube/v3";
const channelList="https://www.googleapis.com/youtube/v3/channels?";

function collapse(){
    sidebar.classList.toggle("small-sidebar");
    container.classList.toggle("large-container");
}

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
    for(let i=0;i<maxResults;i++){
        getChannelIcon(data.items[i]);
    }
    // data.items.forEach(item => {
    //     getChannelIcon(item);
    // });
  } catch (e) {
    console.log(e);
  }
}
fetchVideos("",20)

const getChannelIcon=(video_data)=>{
     fetch(channelList + new URLSearchParams({
        key: API_KEY,
        part: 'snippet',
        id: video_data.snippet.channelId
     }))
     .then(res=> res.json())
     .then(data=>{
        video_data.channelThumbnail=data.items[0].snippet.thumbnails.default.url;
        //console.log(video_data);
          makeVideoCard(video_data);
     })
}



const makeVideoCard = (data)=>{
     const dur=  fetchVideoStats(data.id.videoId, 'statistics');
     dur.then(function resolveDefi(duration) {
        console.log(duration);
        videoConatiner.innerHTML +=`
       <div class="vid-list" >
       <a href="play.html?videoId=${data.id.videoId}"><img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt=""></a>
    
    <div class="flex-div">
        <img src="${data.channelThumbnail}" alt="">
        <div class="vid-info">
            <a href="play.html?videoId=${data.id.videoId}">${data.snippet.title}</a>
            <p>${data.snippet.channelTitle}</p>
            <p> ${duration} Views</p>
            </div>
    </div>
</div>
    `
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
      console.log(data.items[0].statistics.viewCount);
      return data.items[0].statistics.viewCount;
    } catch (e) {
      console.log(e);
    }
  }
  
//   typeOfDetails =>"contentDetails" => duration
// typeOfDetails => "statistics" => viewCount

// fetchVideoStats('YphL3Whh5B0','contentDetails');
// fetchVideoStats('YphL3Whh5B0','statistics');

// searchBtn.addEventListener('click', ()=>{
//     console.log('click',searchInput.value);
//     fetchVideos(searchInput.value,50);
// })

function work(){
    console.log('click',searchInput.value);
    videoConatiner.innerHTML="";
    fetchVideos(searchInput.value,50);
}

document.getElementById('theme-toggle').addEventListener('click', function() {
  const body = document.body;
  if (body.classList.contains('light-theme')) {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
  } else {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
  }
});


// ------------------------comments fetch---------------


  
  //getComments('8b0ubLO2MUE',10);



//   snippet
// : 
// canReply
// : 
// true
// channelId
// : 
// "UCt2JXOLNxqry7B_4rRZME3Q"
// isPublic
// : 
// true
// topLevelComment
// : 
// etag
// : 
// "v48cBmcPG-jceMruEnU1JteNpzU"
// id
// : 
// "UgxSU46r7yBRbsYXBLR4AaABAg"
// kind
// : 
// "youtube#comment"
// snippet
// : 
// {channelId: 'UCt2JXOLNxqry7B_4rRZME3Q', videoId: '8b0ubLO2MUE', textDisplay: '<a href="https://www.youtube.com/watch?v=BYPMlcFmR…ps://youtu.be/BYPMlcFmRGI?si=rEDdx_UBuApPhT41</a>', textOriginal: 'https://youtu.be/BYPMlcFmRGI?si=rEDdx_UBuApPhT41', authorDisplayName: '@CricketStars331', …}
// [[Prototype]]
// : 
// Object
// totalReplyCount
// : 
// 0
// videoId
// : 
// "8b0ubLO2MUE"

