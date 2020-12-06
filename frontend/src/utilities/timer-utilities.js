import { CLIENT_URL } from '../constants/constants';


const formatTime = (timeLeftInSecond) => {
    let hour = Math.floor(timeLeftInSecond / (60 * 60));
    let hourDisplay = hour < 10 ? '0' + hour : hour;
    let minutesLeftInSecond = timeLeftInSecond - hour * 60 * 60;
    let minute = Math.floor(minutesLeftInSecond / 60);
    if (minute < 10) minute = '0' + minute;
  
    let second = minutesLeftInSecond- 60 * minute;
    if (second < 10) second = '0' + second;
  
    return hour > 0? `${hourDisplay}:${minute}:${second}`:`${minute}:${second}`;
  }
  
  const getcurRound = (timer) =>{
     let curStartTime = new Date(timer.startTime);
     let curRound = 0;
     const minutes = timer.duration + timer.breakTime;
     while (new Date().getTime() - curStartTime.getTime() >= 0){
       if(curRound > timer.round) {
           return -1;
       }
       curRound += 1;
       curStartTime = new Date(curStartTime.getTime() + minutes * 60000);
     }
     return curRound;
  
  };
  
  
  const inBreak = (timer, curRound) => {
      if (curRound < 0){
          return false;
      }
      const timePast =  (curRound - 1)*(timer.duration + timer.breakTime) + timer.duration
      const shouldEnd = new Date(new Date(timer.startTime).getTime() + timePast * 60000);
      return new Date().getTime() > shouldEnd.getTime();
  }
  
  const getTimeLeft = (timer, curRound, isBreak) => {
  
      // const timePast =  curRound*(timer.duration + timer.breakTime);
      if (curRound < 0 || curRound > timer.round){
        return 0;
      }
  
      const timeWillPast = (curRound - 1) *(timer.duration + timer.breakTime) + timer.duration + (isBreak? timer.breakTime : 0);
      const willEndAtTime = new Date(new Date(timer.startTime).getTime() + timeWillPast * 60000);
      const timeLeft = Math.round((willEndAtTime.getTime() - new Date().getTime()) / 1000);
      return Math.max(timeLeft, 0);
  
  };


  // todo: move to utilts
const getSharingUrl = (timerId, userId) =>{

    const toEncodeString = `timerId=${timerId}&creator=${userId}`;
    const encodedString = btoa(toEncodeString)
    const sharingUrl = `${CLIENT_URL}/timer/${encodedString}`
    return sharingUrl;
}

const getTimerId = (paramTimerId) => {
    
    let tryParseInt = parseInt(paramTimerId, 10);
    if (isNaN(tryParseInt)) {
      const decodeString = atob(paramTimerId);
      const params = decodeString.split('&')
      const paraObject = {};
      for(var i = 0; i < params.length; i++){
          if(params[i].includes('=')){
              const paramsAttr = params[i].split('=')
              if(paramsAttr.length == 2){
                  paraObject[paramsAttr[0]] = paramsAttr[1];
              }
          }
        }
    
        tryParseInt = parseInt(paraObject.timerId);
        if(isNaN(tryParseInt)){
           tryParseInt = -1;
        }
    } 

    return tryParseInt;


}

  export {
      formatTime,
      getcurRound,
      inBreak,
      getTimeLeft,
      getSharingUrl,
      getTimerId

  }