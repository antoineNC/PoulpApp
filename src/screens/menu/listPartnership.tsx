import { $officeStore } from "@context/officeStore";
import { useUnit } from "effector-react";
import { useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { Card, Searchbar } from "react-native-paper";
import { ListPartnershipProps } from "@navigation/navigationTypes";
import { Image } from "@styledComponents";
import { colors } from "@theme";

export default function ListPartnershipScreen({
  navigation,
}: ListPartnershipProps) {
  const { partnershipList } = useUnit($officeStore);
  const [query, setQuery] = useState("");
  const filteredPartner = partnershipList.filter((partner) => {
    const partnerName = partner.name.toUpperCase();
    const partnerDesc = partner.description?.toUpperCase();
    const queryText = query.toUpperCase();
    return (
      partnerName.indexOf(queryText) > -1 ||
      (partnerDesc && partnerDesc.indexOf(queryText) > -1)
    );
  });
  return (
    <>
      <Searchbar
        placeholder="Sélectionner un partenariat"
        onChangeText={setQuery}
        value={query}
      />
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
    </>
  );
}
