import { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { useStoreMap, useUnit } from "effector-react";
import { Card, Chip, Searchbar } from "react-native-paper";
import { ListClubProps } from "@navigation/navigationTypes";
import { $officeStore } from "@context/officeStore";
import { Container, Image, Row } from "@styledComponents";
import { colors } from "@theme";

export default function ListClubScreen({ navigation }: ListClubProps) {
  const { clubList } = useUnit($officeStore);
  const officeList = useStoreMap({
    store: $officeStore,
    keys: [],
    fn: (officeStore) => {
      const offices = officeStore.officeList.filter((office) =>
        ["BDE", "BDA", "BDS"].includes(office.acronym.toUpperCase())
      );
      return offices;
    },
  });
  const [query, setQuery] = useState("");
  const [filterOffice, setFilterOffice] = useState<Array<string>>([]);
  const filteredClubs = clubList.filter((club) => {
    const clubName = club.name.toUpperCase();
    const clubDesc = club.description?.toUpperCase();
    const queryText = query.toUpperCase();

    const queryFound =
      clubName.indexOf(queryText) > -1 ||
      (clubDesc && clubDesc.indexOf(queryText) > -1);
    const filterByOffice =
      filterOffice.length > 0 ? filterOffice.includes(club.officeId) : true;

    return queryFound && filterByOffice;
  });

  const selectOffice = (id: string) => {
    const index = filterOffice.indexOf(id);
    if (index > -1) {
      setFilterOffice(filterOffice.filter((value) => value !== id));
    } else setFilterOffice([...filterOffice, id]);
  };

  return (
    <Container>
      <Searchbar
        placeholder="Sélectionner un club"
        onChangeText={setQuery}
        value={query}
        style={{ borderRadius: 5, marginHorizontal: 10 }}
      />
      <Row style={{ columnGap: 20, margin: 10, marginLeft: 30 }}>
        {officeList.map((office) => (
          <Chip
            key={office.id}
            selected={filterOffice.includes(office.id)}
            onPress={() => selectOffice(office.id)}
          >
            {office.acronym}
          </Chip>
        ))}
      </Row>
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
    </Container>
  );
}
