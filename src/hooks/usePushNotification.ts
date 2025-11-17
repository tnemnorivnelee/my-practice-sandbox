// 📄 src/hooks/usePushNotification.ts
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

// 1. 앱이 켜져있을 때(Foreground) 알림이 오면 어떻게 할지 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // 알림창 띄우기 (true/false)
    shouldPlaySound: true, // 소리 재생
    shouldSetBadge: false,
    // ⬇️ 아래 두 줄을 추가하면 에러가 사라집니다!
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const usePushNotification = () => {
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined,
  );

  const responseListener = useRef<Notifications.EventSubscription | undefined>(undefined);
  // 2. 권한을 요청하고 "토큰(Push Token)"을 얻는 함수
  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        alert('알림 권한이 없습니다!');
        return;
      }

      // ⭐️ 여기서 내 폰의 고유한 "주소(Token)"를 발급받습니다.
      // (이 토큰을 백엔드에 줘야, 백엔드가 나한테 알림을 쏠 수 있습니다.)
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        })
      ).data;

      console.log('나의 엑스포 푸시 토큰:', token);
    } else {
      alert('실제 기기에서 테스트해야 합니다.');
    }

    return token;
  }

  useEffect(() => {
    // 3. 토큰 발급 실행
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token ?? ''));

    // 4. 사용자가 알림을 "클릭(Tap)" 했을 때 실행되는 리스너
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('알림 클릭함!', response);
      // ⭐️ 여기서 "채팅방 이동" 로직을 짭니다. (나중에)
    });

    return () => {
      if (responseListener.current) {
        // ✅ 최신 방식: 리스너 객체의 .remove()를 직접 호출합니다.
        responseListener.current.remove();
      }
    };
  }, []);

  return {
    expoPushToken, // 내 토큰 (화면에 보여줄 용도)
    notification, // 받은 알림 데이터
  };
};
