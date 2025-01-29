import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type CameraProps = {
  /**
   * Callback for when a photo is taken
   * @param photo - Photo in base64 format
   */
  onPhotoTaken?: (photo: string) => void;
  /**
   * Callback for when the photo is retaken
   */
  onRetake?: () => void;
};

export function Camera({ onPhotoTaken, onRetake }: CameraProps) {
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  // If permission is not granted, ask for it
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePhoto() {
    const picture = await cameraRef.current?.takePictureAsync({ base64: true });
    if (picture && picture.base64) {
      setPhoto(picture.base64);
      onPhotoTaken?.(picture.base64);
    }
  }

  function retakePhoto() {
    setPhoto(null);
    onRetake?.();
  }

  if (photo) {
    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: `data:image/jpeg;base64,${photo}` }}
          style={styles.image}
        />
        <TouchableOpacity style={styles.imageButton} onPress={retakePhoto}>
          <Text style={styles.imageText}>Retake</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        pictureSize="1920x1920"
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  image: {
    width: "90%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 20,
  },
  imageText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#ffffff",
  },
  imageButton: {
    backgroundColor: "#3182ce",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  container: {
    width: "100%",
    height: "60%",
    overflow: "hidden",
    borderRadius: 12,
    marginBottom: 20,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    fontSize: 16,
    color: "#2d3748",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    gap: 10,
    padding: 10,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2d3748",
  },
});
