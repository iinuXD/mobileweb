import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { authService } from "../auth/auth-service";

const Login: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumberE164, setPhoneNumberE164] = useState("");
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const redirectIfLoggedIn = async () => {
      const user = await authService.getCurrentUser();
      if (user) {
        history.replace("/tab1");
      }
    };
    redirectIfLoggedIn();
  }, [history]);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authService.loginWithEmailPassword({ email, password });
      history.replace("/tab1");
    } catch (err: any) {
      setError(err?.message ?? "Email login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.loginWithGoogle();
      history.replace("/tab1");
    } catch (err: any) {
      setError(err?.message ?? "Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartPhoneLogin = async () => {
    if (!phoneNumberE164) {
      setError("Phone number is required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await authService.startPhoneLogin({ phoneNumberE164 });
      setVerificationId(result.verificationId);
    } catch (err: any) {
      setError(err?.message ?? "Phone login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPhoneCode = async () => {
    if (!verificationId || !verificationCode) {
      setError("Verification code is required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authService.confirmPhoneCode({
        verificationId,
        verificationCode,
      });
      history.replace("/tab1");
    } catch (err: any) {
      setError(err?.message ?? "Phone confirmation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Login</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {error && (
              <IonText color="danger">
                <p>{error}</p>
              </IonText>
            )}

            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput
                value={email}
                type="email"
                placeholder="name@example.com"
                onIonChange={(e) => setEmail(e.detail.value ?? "")}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Password</IonLabel>
              <IonInput
                value={password}
                type="password"
                placeholder="Your password"
                onIonChange={(e) => setPassword(e.detail.value ?? "")}
              />
            </IonItem>
            <IonButton
              expand="block"
              onClick={handleEmailLogin}
              disabled={loading}
            >
              Login Email/Password
            </IonButton>

            <IonButton
              expand="block"
              color="tertiary"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              Login Google
            </IonButton>

            <IonItem>
              <IonLabel position="stacked">Phone (+66...)</IonLabel>
              <IonInput
                value={phoneNumberE164}
                type="tel"
                placeholder="+66812345678"
                onIonChange={(e) => setPhoneNumberE164(e.detail.value ?? "")}
              />
            </IonItem>
            <IonButton
              expand="block"
              color="secondary"
              onClick={handleStartPhoneLogin}
              disabled={loading}
            >
              Login by Phone
            </IonButton>

            {verificationId && (
              <>
                <IonItem>
                  <IonLabel position="stacked">Verification Code</IonLabel>
                  <IonInput
                    value={verificationCode}
                    type="text"
                    placeholder="123456"
                    onIonChange={(e) => setVerificationCode(e.detail.value ?? "")}
                  />
                </IonItem>
                <IonButton
                  expand="block"
                  color="success"
                  onClick={handleConfirmPhoneCode}
                  disabled={loading}
                >
                  Confirm Code
                </IonButton>
              </>
            )}

            <div id="recaptcha-container" />
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Login;