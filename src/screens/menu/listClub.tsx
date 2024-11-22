import { $officeStore } from "@context/officeStore";
import { useUnit } from "effector-react";
import { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Card, Searchbar } from "react-native-paper";
import { ListClubProps } from "@navigation/navigationTypes";
import { Image } from "@styledComponents";
import { colors } from "@theme";

export default function ListClubScreen({ navigation }: ListClubProps) {
  const { clubList } = useUnit($officeStore);
  const [query, setQuery] = useState("");
  const filteredClubs = clubList.filter((club) => {
    const clubName = club.name.toUpperCase();
    const clubDesc = club.description?.toUpperCase();
    const queryText = query.toUpperCase();
    return (
      clubName.indexOf(queryText) > -1 ||
      (clubDesc && clubDesc.indexOf(queryText) > -1)
    );
  });
  return (
    <>
      <Searchbar
        placeholder="Sélectionner un club"
        onChangeText={setQuery}
        value={query}
      />
      <FlatList
        data={filteredClubs}
        contentContainerStyle={{
          rowGap: 10,
          padding: 10,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("viewClub", { clubId: item.id })}
          >
            <Card contentStyle={{ flexDirection: "row" }}>
              <Card.Title
                title={item.name}
                subtitle={item.description}
                left={(props) => (
                  <View style={{ borderRadius: 5, overflow: "hidden" }}>
                    <Image
                      source={
                        item.logoUrl
                          ? { uri: item.logoUrl }
                          : require("@assets/no_image_available.png")
                      }
                      $size={props.size}
                      style={{
                        width: props.size,
                        height: props.size,
                        backgroundColor: colors.secondary,
                      }}
                    />
                  </View>
                )}
                style={{ flex: 1 }}
              />
            </Card>
          </TouchableOpacity>
        )}
      />
    </>
  );
}
