import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { updateDoc } from "firebase/firestore";
import { useFonts } from "expo-font";

export default function Film(props) {
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
      size: 20,
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
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        flex: 1,
        flexDirection: "column",
      }}
    >
      <View style={{ marginRight: 1 }}>
        {!props.film.isFilmFull ? (
          <MaterialCommunityIcons
            name="film"
            size={60}
            color="black"
            onPress={newFilmHandler}
          />
        ) : (
          <Entypo
            name="circle-with-plus"
            size={50}
            color="black"
            onPress={newFilmHandler}
          />
        )}
      </View>

      <View style={[styles.film]}>
        <Text style={styles.filmText}>
          {props.film.isFilmFull
            ? `New Film`
            : props.film.photosTaken + "/" + props.film.size}
        </Text>
      </View>
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
});
