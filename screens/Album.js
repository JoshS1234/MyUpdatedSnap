import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import PolaroidCard from "../components/PolaroidCard";

const Album = ({ route, navigation }) => {
  const photosArray = route.params.album.photos;

  const albumName = route.params.album.name;
  const albumNumber = route.params.album.albumNumber;

  function renderItem({ item, index }) {
    return (
      <PolaroidCard
        photoObj={item}
        date={item.date}
        index={index}
        albumName={albumName}
        albumNumber={albumNumber}
        photosArray={photosArray}
      />
    );
  }

  return (
    <ImageBackground
      source={require("../cork.jpeg")}
      style={{ backgroundColor: "gray", flex: 1 }}
    >
      <FlatList
        data={photosArray}
        renderItem={renderItem}
        keyExtractor={(item) => item.URL}
      />
    </ImageBackground>
  );
};

export default Album;

const styles = StyleSheet.create({});
