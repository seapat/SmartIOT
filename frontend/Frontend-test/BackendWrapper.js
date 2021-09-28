import Session from "./session.js";
import Backend from "./api.js"
import { PreferencesContext } from "./PreferencesContext.js";

const backend = new Backend("SERVER URL HERE")
global.backend = backend;

var userMeasurements = new Map();
global.userMeasurements = userMeasurements;

// aparently that is a safe way to avoid stacking calls if the previous did not have a proper response
// Cannot handle rejects, can be called many times -> may be a problem!
var sleep = time => new Promise((resolve) => setTimeout(resolve, time))
var poll = (promiseFn, time) => promiseFn().then(
    sleep(time).then(() => poll(promiseFn, time)).catch(console.log));

// Never rejects, just prints errors and does nothing.
poll(() => new Promise((resolve) => {
    console.log("polling works: " + new Date().toLocaleString());
    
    let session = Session.get()
    if(session == null) console.log("No Session yet.");
    else {

        updateData()

        // console.log(getLatestData());
        // console.log(userMeasurements);
    }
}), 60000) // in milliseconds

function updateData() {
    /** get data from backend and write to  measurement object */

    let currSession = Session.get()
    if(currSession == null) {
        console.log("No Session yet.");
        return
    }

    backend.getDevices(currSession).then((response) => {

        response.forEach( (device) => {

            // get data for curr Device
            backend.getStats( 
                Session.get(), // currSession
                device.device_hash,
                unixTimeLastMonth
            ) 
            // fill map of objects containg measurement data (device hash as key)
            .then((data) =>{ 
                userMeasurements.set(
                device.id, new Map(Object.entries(data)))}
            ).catch(console.log);
        })
    }).catch(console.err)
}

const unixTimeLastMonth = () => {
    /** get date from previous month and convert to unix time */

    // Get a date object for the current time
    var d = new Date();
    d.setMonth(d.getMonth() - 1);
    // Zero the time component
    d.setHours(0, 0, 0, 0);
    // Get the time value in milliseconds and convert to seconds
    return d / 1000 | 0;
}

function getLatestData() {
    /** creates nested map of maps, each device holds its latest values */
    
    let allDevices = new Map();
    userMeasurements.forEach((deviceData, device) => {
        let currDevice = new Map();
        deviceData.forEach((valueObj, valueType) => {
        
            let valueArray = valueObj.data;
            // last value in the array is the latest, idx 0 -> value itself
            let latestValue = valueArray.length != 0 ? valueArray[valueArray.length - 1][0] : "unknown"
            currDevice.set(valueType, latestValue)
        })

        allDevices.set(device,currDevice);
    });
    return allDevices;
};

export { getLatestData, updateData, poll };


/* Example return of getLatestData() -> brackets represent Maps

------------
userMeasurements looks similar but temp (and others) contain a object liek this:
{
    "key": "temp",
    "value": {
        "data": [
            [
                25,
                1629194445
            ],
            [
                25,
                1629541014
            ]
        ],
        "stats": {
            "mean": 23.076923076923077
        }
    }
}
-------------

[[1, <----- device.id
    [["co2","unkown"],
    ["temp","unkown"],
    ["pressure","unkown"],
    ["humidity","unkown"],
    ["iaq","unkown"]]
],
[2,
    [["co2","unkown"],
    ["temp","unkown"],
    ["pressure","unkown"],
    ["humidity","unkown"],
    ["iaq","unkown"]]
], ...]
*/ 