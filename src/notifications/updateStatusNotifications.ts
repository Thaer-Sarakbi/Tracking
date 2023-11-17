import PushNotification, {Importance} from 'react-native-push-notification';

export const updateStatusNotifi = () => {
    PushNotification.createChannel(
        {
          channelId: "update-status", // (required)
          channelName: "update status", // (required)
        },
        (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
      );   
}