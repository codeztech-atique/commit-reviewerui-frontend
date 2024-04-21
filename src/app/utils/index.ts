import jwt_decode from 'jwt-decode';


export function getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
}

export function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function timeDifference(start, end) {
  var difference = end - start;

  var daysDifference = Math.floor(difference/1000/60/60/24);
  difference -= daysDifference*1000*60*60*24

  var hoursDifference = Math.floor(difference/1000/60/60);
  difference -= hoursDifference*1000*60*60

  var minutesDifference = Math.floor(difference/1000/60);
  difference -= minutesDifference*1000*60

  var secondsDifference = Math.floor(difference/1000);
  var finalString = "";
  if(daysDifference > 0) {
    finalString +=  daysDifference + ' days ';
  } if(hoursDifference > 0) {
    finalString +=  hoursDifference + ' hours ';
  } if(minutesDifference > 0) {
    finalString +=   minutesDifference + ' minutes ';
  } if(secondsDifference > 0) {
    finalString +=   secondsDifference + ' seconds ';
  }
  return (finalString)
}

export function addTime(prevTime, startedWorkingOn) {
  var timeValue = prevTime;

  // Convert the time value to milliseconds
  var timeRegex = /(\d+)\s+(\w+)/g;
  var totalMilliseconds = 0;
  var match;
  while ((match = timeRegex.exec(timeValue)) !== null) {
    var value = parseInt(match[1]);
    var unit = match[2].toLowerCase();
    switch (unit) {
      case "days":
        totalMilliseconds += value * 24 * 60 * 60 * 1000;
        break;
      case "hours":
        totalMilliseconds += value * 60 * 60 * 1000;
        break;
      case "minutes":
        totalMilliseconds += value * 60 * 1000;
        break;
      case "seconds":
        totalMilliseconds += value * 1000;
        break;
      default:
        break;
    }
  }

  // Get the current timestamp in milliseconds
  var currentTime = startedWorkingOn;

  // Subtract the time value from the current timestamp
  var result = currentTime - totalMilliseconds;
  return result;
}

export function totalHoursRoundOf(totalTime) {
  const totalTimeTaken = totalTime.trim().split(" ");
  var totalTimeInHours = 0;
  for(let i = 1; i < totalTimeTaken.length; i = i + 2) {
    if(totalTimeTaken[i] == 'days') {
      let daysIntoHour = parseInt(totalTimeTaken[i - 1]) * 24;
      totalTimeInHours += daysIntoHour;
    } if(totalTimeTaken[i] == 'hours') {
      let daysIntoHour = parseInt(totalTimeTaken[i - 1]);
      totalTimeInHours += daysIntoHour;
    } if(totalTimeTaken[i] == 'minutes') {
      let daysIntoHour = 1;
      totalTimeInHours += daysIntoHour;
    }
  }
  return (totalTimeInHours)
}


export function getFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return ''; // Return an empty string if there's no file extension
  }
  return fileName.slice(lastDotIndex);
}