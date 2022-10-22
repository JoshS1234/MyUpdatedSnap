import { useEffect, useState } from "react";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from "react-native";

import { storage, auth, db } from "../firebaseSetup";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Film from "./Film";
import * as ImageManipulator from "expo-image-manipulator";

import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { TouchableOpacity } from "react-native";
import colorMain from "../assets/colors/colorMain";

export default function CameraControls({ cameraRef, setImage, image }) {
  const [film, setFilm] = useState(null);
  const email = auth.currentUser?.email;
  const docRef = doc(db, "users", email);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrFilm = async () => {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userAlbums = docSnap.data().albums;
      const currFilm = docSnap.data().currFilm;
      setFilm(() => {
        const newFilm = userAlbums[currFilm];
        newFilm.index = currFilm;
        return newFilm;
      });
    } else {
      console.log("No such document!");
    }
  };
  useEffect(() => {
    getCurrFilm();
  }, []);

  const updateDbWhenPhotoTaken = async (film) => {
    if (!film) return;
    const photosTakenProp = `albums.${film.index}.photosTaken`;
    const photosProp = `albums.${film.index}.photos`;
    const isFilmFullProp = `albums.${film.index}.isFilmFull`;
    try {
      await updateDoc(docRef, {
        [photosTakenProp]: film.photosTaken,
        [photosProp]: arrayUnion(film.photos[film.photos.length - 1]),
        [isFilmFullProp]: film.isFilmFull,
      });
      console.log("updated database");
    } catch (err) {
      alert(err);
      console.log(err);
    }
  };

  // const uploadPhoto = async (crop, imageRef) => {
  //   const img = await fetch(crop.uri);
  //   const bytes = await img.blob();
  //   uploadBytes(imageRef, bytes)
  //     .then(() => {
  //       console.log(
  //         "photo uploaded: ",
  //         `/user_${auth.currentUser?.email}/albums/${film.name}/${film.photosTaken}`
  //       );

  //       return getDownloadURL(
  //         ref(storage, `user_${email}/albums/${film.name}/${film.photosTaken}`)
  //       );
  //     })
  //     .then((url) => {
  //       setFilm((currFilm) => {
  //         const newFilm = { ...currFilm };
  //         newFilm.photos.push({ date: Date.now(), URL: url });
  //         newFilm.photosTaken = currFilm.photosTaken + 1;

  //         return newFilm;
  //       });
  //       setIsLoading(false);
  //     })
  //     // .then(() => {
  //     //   resetImage();
  //     // })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const takePicture = async () => {
    console.log("in takepic function");
    if (film.isFilmFull) {
      alert("Change film before taking more photos");
      return;
    }

    setIsLoading(true);

    if (cameraRef) {
      try {
        console.log("in camera ref");
        const data = await cameraRef.current.takePictureAsync();
        setImage("../fakeImage.jpeg");
        const crop = await ImageManipulator.manipulateAsync(data.uri, [
          {
            resize: {
              width: 600,
              height: 600,
            },
          },
        ]);
        await setImage(crop.uri);

        const imageRef = ref(
          storage,
          `${film.path + film.name}/${film.photosTaken}`
        );

        const img = await fetch(crop.uri);
        const bytes = await img.blob();
        uploadBytes(imageRef, bytes)
          .then(() => {
            setImage(crop.uri);
            console.log(
              "photo uploaded: ",
              `/user_${auth.currentUser?.email}/albums/${film.name}/${film.photosTaken}`
            );

            setIsLoading(false);
            return getDownloadURL(
              ref(
                storage,
                `user_${email}/albums/${film.name}/${film.photosTaken}`
              )
            );
          })
          .then((url) => {
            const newFilm = { ...film };
            newFilm.photos.push({ date: Date.now(), URL: url });
            newFilm.photosTaken = film.photosTaken + 1;
            if (newFilm.photosTaken >= newFilm.size) {
              newFilm.isFilmFull = true;
            }
            updateDbWhenPhotoTaken(newFilm);

            setFilm(newFilm);
          });

        //uploadPhoto(crop, imageRef);
      } catch (e) {
        setIsLoading(false);
        console.log(e);
      }
    }
  };

  const resetImage = () => {
    setImage(null);
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ImageBackground
        // source={require("../black-background.jpg")}
        style={{
          borderStyle: "solid",
          borderColor: "black",
          borderWidth: 3,
          backgroundColor: "white",
          borderTopColor: "white",
          flex: 1,
          padding: 15,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 15,
        }}
      >
        <TouchableOpacity
          style={[styles.cameraButtonsContainer]}
          onPress={!image ? takePicture : resetImage}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : !image ? (
            <MaterialIcons name="photo-camera" size={45} color="white" />
          ) : (
            <>
              <Entypo name="back" size={24} color="white" />
            </>
          )}
        </TouchableOpacity>
      </ImageBackground>
      <ImageBackground
        source={require("../filmreel.jpg")}
        // source={require("../filmcartoonblack.png")}
        style={[styles.filmButtonsContainer]}
      >
        <Film
          email={email}
          docRef={docRef}
          setFilm={setFilm}
          film={
            film
              ? film
              : { name: "", size: 0, photosTaken: 0, isFilmFull: false }
          }
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  filmButtonsContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginLeft: -40,
    marginRight: -40,
    // width: 100,
    // height: 200,
  },
  cameraButtonsContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 5,
    borderRadius: 100,
    width: 80,
    height: 80,
    backgroundColor: colorMain,
    // backgroundColor: "#e0bbe4",
    opacity: 1,
  },
});
