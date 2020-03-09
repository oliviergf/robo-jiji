//public vapid of our server!
const publicVapidKey =
  "BFkjlGMNKytjD2oOnED0Zb9ENXZqopsSRAQjZMun-RQDzjy6AX7qOpMHNjeVnYgBXSdgnf783Y1nSt9DwmqG8ko";

/**
 * urlBase64ToUint8Array
 *
 * @param {string} base64String a public vavid key
 */
function urlBase64ToUint8Array(base64String) {
  var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Let User know somehow that if they push ''block'' they'll need to disable it
 * in settings.
 */
export async function askPushPermission() {
  console.log("asking Permission");
  return new Promise(function(resolve, reject) {
    const permissionResult = Notification.requestPermission(function(result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then(function(permissionResult) {
    if (permissionResult !== "granted") {
      throw new Error("We weren't granted permission.");
    }
  });
}

export function subscribeUserToPush() {
  return navigator.serviceWorker
    .register("/service-worker.js")
    .then(function(registration) {
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      };

      return registration.pushManager.subscribe(subscribeOptions);
    })
    .then(function(pushSubscription) {
      console.log(
        "Received PushSubscription: ",
        JSON.stringify(pushSubscription)
      );
      sendSubscriptionToBackEnd(pushSubscription);
      return pushSubscription;
    })
    .catch(err => console.log(err));
}

function sendSubscriptionToBackEnd(subscription) {
  return fetch("http://localhost:3000/subscribeNotif", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(subscription)
  })
    .then(function(response) {
      if (!response.ok) {
        throw new Error("Bad status code from server.");
      }

      return response.json();
    })
    .then(function(responseData) {
      if (!(responseData.data && responseData.data.success)) {
        throw new Error("Bad response from server.");
      }
    });
}
