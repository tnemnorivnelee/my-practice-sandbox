// 📄 src/hooks/usePushNotification.ts
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
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

    // 4. 사용자가 알림을 "클릭" 했을 때 실행되는 리스너
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('알림 클릭함!', response);

      // 1. 아까 Expo 도구에서 "Data" 칸에 넣은 JSON을 꺼냅니다.
      const data = response.notification.request.content.data;

      // 2. "type"이 "CHAT"이면 채팅방으로 이동!
      if (data.type === 'CHAT' && data.roomId) {
        // (주의: 실제로 이 경로의 파일이 있어야 에러가 안 납니다.
        //  없다면 '/(tabs)/practice' 같은 존재하는 경로로 테스트해보세요)
        console.log('채팅방으로 이동합니다:', data.roomId);

        // router.push(`/party/chat/${data.roomId}`); // 실제 구현 시
        router.push('/(tabs)/practice'); // 샌드박스 테스트용 (연습 탭으로 이동)
      }
    });
  }, []);

  return {
    expoPushToken, // 내 토큰 (화면에 보여줄 용도)
    notification, // 받은 알림 데이터
  };
};
