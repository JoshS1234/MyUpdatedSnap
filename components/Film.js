import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { updateDoc } from "firebase/firestore";
import { useFonts } from "expo-font";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { useState } from "react";
import { BottomTabBarHeightCallbackContext } from "@react-navigation/bottom-tabs";

export default function Film(props) {
  const [filmSize, setFilmSize] = useState(5);

  const [loaded] = useFonts({
    Handlee: require("../assets/fonts/PressStart2P-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  const newFilmHandler = () => {
    if (!props.film.isFilmFull) {
      alert("You need to finish the current film before replacing");
      // console.log("Film not full");
      return;
    }

    const newFilm = {
      name: `Album ${props.film.index + 2}`,
      size: filmSize,
      photosTaken: 0,
      isFilmFull: false,
      path: `user_${props.email}/albums/`,
      photos: [],
      index: props.film.index + 1,
    };
    const albumProp = `albums.${newFilm.index}`;
    updateDoc(props.docRef, {
      [albumProp]: newFilm,
      currFilm: newFilm.index,
    })
      .then(() => {
        props.setFilm(newFilm);
        console.log("updated database");
      })
      .catch((err) => {
        alert(err);
        console.log(err);
      });
  };
  return (
    <View style={styles.filmButtonArea}>
      {!props.film.isFilmFull ? (
        <View>
          <MaterialCommunityIcons
            name="film"
            size={40}
            color="black"
            onPress={newFilmHandler}
          />
          <Text>{props.film.photosTaken + "/" + props.film.size}</Text>
        </View>
      ) : (
        <View>
          <Menu>
            <MenuOptions>
              <MenuOption
                onSelect={() => {
                  alert("Selected: 5 photos (default)");
                  setFilmSize(5);
                  newFilmHandler();
                }}
                text="New film size: 5 photos"
              />
              <MenuOption
                onSelect={() => {
                  alert("Selected: 10 photos");
                  setFilmSize(10);
                  newFilmHandler();
                }}
                text="New film size: 10 photos"
              />
              <MenuOption
                onSelect={() => {
                  alert("Selected: 20 photos");
                  setFilmSize(20);
                  newFilmHandler();
                }}
                text="New film size: 20 photos"
              />
            </MenuOptions>
            <MenuTrigger>
              <MaterialCommunityIcons name="film" size={40} color="black" />
              <Text>{props.film.photosTaken + "/" + props.film.size}</Text>
              <Text>Press for new Film</Text>
            </MenuTrigger>
          </Menu>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  film: {
    backgroundColor: "black",
    color: "white",
    // margin: 10,
    borderRadius: 20,
  },
  filmText: {
    fontFamily: "Handlee",
    fontSize: 14,
    color: "white",
    padding: 5,
    // margin: 5,
  },
  filmButtonArea: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    flex: 1,
  },
});
