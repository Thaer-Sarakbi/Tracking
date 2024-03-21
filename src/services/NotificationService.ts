const server_key = 'AAAAmy4HlUs:APA91bF8iJqOhOtJGfs3DiqJP5DWF-NgGbGpNtZ11ObDBrq6eyGfBH4xH5f2vDyRfidyWZnZbJy9qnX6to495_fJ_Yy91Li48qNx8o952kUjsUy_eY2Uua7JV-i1hrC_7-rh2iz5LOoH'

const sendSingleDeviceNotification = (data: { notification: {description: string}, token: string | undefined, message: string }) => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append(
      'Authorization',
      `key=${server_key}`,
    );
  
    var raw = JSON.stringify({
      data: data.notification,
      notification: {
        body: data.notification.description,
        title: data.message
      },
      to: data.token
    });
  
    var requestOptions: any = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
  
    fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
      .then(response => response.text())
      // .then(result => console.log(result))
      .catch(error => console.log('error', error));
  };
  
  const sendMultiDeviceNotification = (data: { body: string, title: string, token: string }) => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append(
      'Authorization',
      `key=${server_key}`
    );
  
    var raw = JSON.stringify({
      data: {},
      notification: {
        body: data.body,
        title: data.title,
      },
      registration_ids: data.token,
    });
  
    var requestOptions: any = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
  
    fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  };
  
  export default {
    sendSingleDeviceNotification,
    sendMultiDeviceNotification,
  };