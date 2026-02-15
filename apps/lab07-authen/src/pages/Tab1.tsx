import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { authService } from '../auth/auth-service';
import type { AuthUser } from '../auth/auth-interface';
import './Tab1.css';

const Tab1: React.FC = () => {
  const history = useHistory();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUser();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    history.replace("/login");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Current User</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {loading ? (
              <IonLabel>Loading...</IonLabel>
            ) : !user ? (
              <IonLabel>No user signed in.</IonLabel>
            ) : (
              <>
                <IonList>
                  <IonItem>
                    <IonLabel>uid</IonLabel>
                    <IonLabel slot="end">{user.uid}</IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>email</IonLabel>
                    <IonLabel slot="end">{user.email ?? '-'}</IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>phoneNumber</IonLabel>
                    <IonLabel slot="end">{user.phoneNumber ?? '-'}</IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>displayName</IonLabel>
                    <IonLabel slot="end">{user.displayName ?? '-'}</IonLabel>
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel>photoUrl</IonLabel>
                    <IonLabel slot="end">{user.photoUrl ?? '-'}</IonLabel>
                  </IonItem>
                </IonList>
                <IonButton expand="block" color="danger" onClick={handleLogout}>
                  Logout
                </IonButton>
              </>
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
