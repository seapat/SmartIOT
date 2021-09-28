import AsyncStorage  from '@react-native-async-storage/async-storage';

// Should be handled with more secure methods but not that important atm.
const Session = (function() {

    // Alarms should be encrypted or something based on session. Currently indexed by session.. uh.
    let cachedSession = {'quinternity@session':null, 'quinternity@alarms':null};

    /**
     * @param callback This will be called back with the value if the async method finishes, if required. 
     * (if this returns anything but null it will not be used)
     * @returns value or null (error or empty)
     */
    var get = function(callback=()=>{}, key='quinternity@session') {
      if(cachedSession[key] == null) {
        // Cache all keys.
        Object.keys(cachedSession).forEach((val) => {
          updateCache(val == key ? callback : ()=>{}, val);
        });
      }

      return cachedSession[key];
    };

    var set = function(session, key='quinternity@session') {
      cachedSession[key] = session;
      setStorage(session, key);
    };

    // Async methods I do not want to deal with.
    const updateCache = (callback=()=>{}, key='quinternity@session') => {
      AsyncStorage.getItem(key).then((data) => {
        cachedSession[key] = JSON.parse(data);
        callback(JSON.parse(data));
      }).catch((err) => {
        console.log("Error updating cache:"+err);
      })
    }

    const setStorage = (session, key='quinternity@session') => {
      AsyncStorage.setItem(key, JSON.stringify(session)).then(() => {}).catch((err) => {
        console.log("Error:"+err);
      })
    }
    
    return {
      get: get,
      set: set
    }

  })();

export default Session;