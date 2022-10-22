import { View, Text, StyleSheet, Alert } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { auth, db } from "../firebaseSetup";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

const ChangeAlbumName = ({ route }) => {
  //   const currentTitle = route.params.album.name;

  const [currentTitle, setCurrentTitle] = useState(route.params.album.name);
  const [tempTitle, setTempTitle] = useState(currentTitle);
  const [isEditModeOn, setIsEditModeOn] = useState(false);
  useEffect(() => {
    setTempTitle(currentTitle);
  }, [currentTitle]);

  const email = auth.currentUser?.email;
  const docRef = doc(db, "users", email);

  const switchToEdit = () => {
    setIsEditModeOn(true);
  };

  // const updateDbWhenAlbumRenamed = async (name) => {
  //   if (!name) return;
  //   const photosTakenProp = `albums.${film.index}.photosTaken`;
  //   const photosProp = `albums.${film.index}.photos`;
  //   const isFilmFullProp = `albums.${film.index}.isFilmFull`;
  //   try {
  //     await updateDoc(docRef, {
  //       [photosTakenProp]: film.photosTaken,
  //       [photosProp]: arrayUnion(film.photos[film.photos.length - 1]),
  //       [isFilmFullProp]: film.isFilmFull,
  //     });
  //     console.log("updated database");
  //   } catch (err) {
  //     alert(err);
  //     console.log(err);
  //   }
  // };

  const saveNewTitle = async () => {
    //Updates DB
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // const currentFilm = docSnap.data().currFilm;
      const albums = docSnap.data().albums;
      let thisAlbum;
      let thisKey;
      for (album in albums) {
        for (key in album) {
          if (albums[key].name === currentTitle) {
            thisAlbum = { ...albums[key] };
            thisKey = key;
            thisAlbum.name = tempTitle;
            console.log("Updated album: ", thisAlbum);

            const docRef2 = doc(db, `users`, email);
            try {
              const docSnap = await getDoc(docRef);
              const albumsList = docSnap.data().albums;
              albumsList[thisKey] = thisAlbum;
              console.log(albumsList);
              await updateDoc(docRef2, { albums: albumsList });
              console.log("updated?");
            } catch (err) {
              alert(err);
              console.log(err);
            }
          }
        }
      }
    }

    //Changes title
    setCurrentTitle(tempTitle);

    //Switches out of edit mode
    setIsEditModeOn(false);
  };

  if (!isEditModeOn) {
    return (
      <View style={styles.headingBar}>
        <Text style={{ fontSize: 20, width: "92%" }}>{currentTitle}</Text>
        <Entypo
          style={{ flex: 1 }}
          name="new-message"
          size={24}
          color="gray"
          onPress={() => {
            switchToEdit();
          }}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.headingBarInput}>
        {/* Become a text entry */}
        <TextInput
          style={{
            backgroundColor: "ghostwhite",
            fontSize: 20,
            width: "80%",
            textAlign: "center",
          }}
          placeholder="New title..."
          onChangeText={(text) => {
            setTempTitle(text);
          }}
          onSubmitEditing={saveNewTitle}
        ></TextInput>
        <MaterialCommunityIcons
          name="check-decagram"
          size={24}
          color="black"
          onPress={() => {
            saveNewTitle();
          }}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  headingBar: {
    flexDirection: "row",
    // backgroundColor: "blue",
    width: "95%",
    marginLeft: -30,
    justifyContent: "space-around",
    alignItems: "center",
  },
  headingBarInput: {
    flexDirection: "row",
    width: "95%",
    marginLeft: -30,
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default ChangeAlbumName;
