import { useContext, useEffect, useState } from "react";
import { ImageBackground, ScrollView, StyleSheet, View } from "react-native";
import AlbumCard from "../components/AlbumCard";
import { AlbumContext } from "../context/AlbumContext";
import { storage, auth, db } from "../firebaseSetup";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useIsFocused } from "@react-navigation/native";
import colorMain from "../assets/colors/colorMain";

export default function Albums() {
  const email = auth.currentUser?.email;
  const docRef = doc(db, "users", email);
  const [albums, setAlbums] = useState([]);

  const isFocused = useIsFocused();

  const getData = async () => {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      ///
      const userAlbums = docSnap.data().albums;
      const returnArray = [];

      Object.keys(userAlbums).map((albumIndex) => {
        console.log(albumIndex);
        returnArray.push([userAlbums[albumIndex], albumIndex]);
      });
      await setAlbums(returnArray);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  useEffect(() => {
    if (isFocused) {
      getData();
    }
  }, [isFocused]);

  return (
    <ImageBackground source={require("../Bookshelf.png")} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} style={{ flex: 1 }}>
        <ImageBackground
          style={styles.albumsList}
          // source={require("../potentialBG/10doodles.png")}
        >
          {console.log("List of albums >>>", albums)}

          {albums.map((album) => (
            <AlbumCard
              album={album[0]}
              albumNumber={album[1]}
              key={album[0].name}
            />
          ))}
        </ImageBackground>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {},
  albumsList: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    height: "100%",
    width: "100%",
  },
});
