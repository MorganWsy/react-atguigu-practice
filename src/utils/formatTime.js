export default function formatTime(time) {
  let currentTime = new Date(time);

  let month = currentTime.getMonth() + 1;
  let day = currentTime.getDate();  
  let hour = currentTime.getHours();
  let minutes = currentTime.getMinutes();
  let seconds = currentTime.getSeconds();
  month = month >= 10 ? month : '0' + month;
  day = day >= 10 ? day : '0' + day;
  hour = hour >= 10 ? hour : '0' + hour;
  minutes = minutes >= 10 ? minutes : '0' + minutes;
  seconds = seconds >= 10 ? seconds : '0' + seconds;
  // 最终的格式为2022-3-19 11:24:30
  return currentTime.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
}