import { $officeStore } from "@context/officeStore";
import { useStoreMap, useUnit } from "effector-react";
import { useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { Card, Chip, Searchbar } from "react-native-paper";
import { ListPartnershipProps } from "@navigation/navigationTypes";
import { Container, Image, Row } from "@styledComponents";
import { colors } from "@theme";

export default function ListPartnershipScreen({
  navigation,
}: ListPartnershipProps) {
  const { partnershipList } = useUnit($officeStore);
  const officeList = useStoreMap({
    store: $officeStore,
    keys: [],
    fn: (officeStore) => {
      const offices = officeStore.officeList.filter((office) =>
        ["BDE", "BDA", "BDS", "I2C"].includes(office.acronym.toUpperCase())
      );
      return offices;
    },
  });
  const [query, setQuery] = useState("");
  const [filterOffice, setFilterOffice] = useState<Array<string>>([]);
  const filteredPartner = partnershipList.filter((partner) => {
    const partnerName = partner.name.toUpperCase();
    const partnerDesc = partner.description?.toUpperCase();
    const queryText = query.toUpperCase();

    const queryFound =
      partnerName.indexOf(queryText) > -1 ||
      (partnerDesc && partnerDesc.indexOf(queryText) > -1);
    const filterByOffice =
      filterOffice.length > 0 ? filterOffice.includes(partner.officeId) : true;

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
        placeholder="Sélectionner un partenariat"
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
        data={filteredPartner}
        contentContainerStyle={{
          rowGap: 10,
          padding: 10,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("viewPartnership", { partnershipId: item.id })
            }
          >
            <Card contentStyle={{ flexDirection: "row" }}>
              <Card.Title
                title={item.name}
                subtitle={item.description}
                left={(props) => (
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
