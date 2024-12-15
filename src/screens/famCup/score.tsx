import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Alert,
} from "react-native";
import { useUnit } from "effector-react";
import { AnimatedFAB, Button, Divider } from "react-native-paper";
import { CartesianChart, Bar } from "victory-native";
import { useFont } from "@shopify/react-native-skia";
import { ScoreProps } from "@navigation/navigationTypes";
import { $pointStore } from "@context/pointStore";
import { formatDay } from "utils/dateUtils";
import { useRight } from "utils/rights";
import inter from "@assets/fonts/inter-variable.ttf";
import { colors } from "@theme";
import { Container, Row, Title2, Text } from "@styledComponents";
import { deletePoint } from "@fb/service/point.service";

export default function ScoreScreen({ navigation }: ScoreProps) {
  const listPoint = useUnit($pointStore);
  const { hasRight } = useRight();
  const font = useFont(inter, 12);
  const [isExtended, setIsExtended] = useState(true);
  const [score, setScore] = useState<{ family: string; score: number }[]>([
    {
      family: "Rouge",
      score: 0,
    },
    {
      family: "Jaune",
      score: 0,
    },
    {
      family: "Bleu",
      score: 0,
    },
    {
      family: "Orange",
      score: 0,
    },
    {
      family: "Vert",
      score: 0,
    },
  ]);

  useEffect(() => {
    const newScore = {
      red: 0,
      yellow: 0,
      blue: 0,
      orange: 0,
      green: 0,
    };
    listPoint.forEach((point) => {
      newScore.blue += point.blue;
      newScore.yellow += point.yellow;
      newScore.orange += point.orange;
      newScore.red += point.red;
      newScore.green += point.green;
    });
    setScore([
      { family: "Bleu", score: newScore.blue },
      { family: "Jaune", score: newScore.yellow },
      { family: "Orange", score: newScore.orange },
      { family: "Rouge", score: newScore.red },
      { family: "Vert", score: newScore.green },
    ]);
  }, [listPoint]);

  const maxScore = Math.max(...score.map((el) => el.score));

  const getColor = useCallback((family: string) => {
    switch (family) {
      case "Rouge":
        return "red";
      case "Jaune":
        return "yellow";
      case "Bleu":
        return "#0058B2";
      case "Orange":
        return "orange";
      case "Vert":
        return "green";
      default:
        break;
    }
  }, []);

  const onScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  return (
    <Container>
      <View style={{ height: 250 }}>
        <CartesianChart
          data={score}
          xKey="family"
          yKeys={["score"]}
          xAxis={{
            font,
            lineWidth: 0,
            // labelColor: colors.white,
          }}
          yAxis={[{ lineWidth: 0 }]}
          padding={10}
          domainPadding={{ left: 40, right: 40 }}
          domain={{ y: [0, maxScore + 5] }}
        >
          {({ points, chartBounds }) => {
            return points.score.map((point, index) => (
              <Bar
                key={index}
                points={[point]}
                chartBounds={chartBounds}
                color={getColor(point.xValue.toString())}
                roundedCorners={{ topLeft: 3, topRight: 3 }}
                barWidth={60}
                labels={{
                  font,
                  position: "top",
                  // color: colors.white,
                }}
              />
            ));
          }}
        </CartesianChart>
      </View>
      <Divider style={{ marginTop: 20 }} />
      <FlatList
        onScroll={onScroll}
        data={listPoint}
        contentContainerStyle={{ rowGap: 10, marginHorizontal: 10 }}
        ItemSeparatorComponent={() => <Divider />}
        ListFooterComponent={<View style={{ marginVertical: 40 }} />}
        renderItem={({ item, index }) => {
          const date = formatDay(item.date.toDate());
          return (
            <View key={index} style={{ paddingHorizontal: 15 }}>
              <Title2>{item.title}</Title2>
              <Text>{date}</Text>
              <Row $justify="space-between" $padding="10px 0">
                <View style={{ alignItems: "center" }}>
                  <Text>Bleu</Text>
                  <Text>{item.blue}</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text>Jaune</Text>
                  <Text>{item.yellow}</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text>Orange</Text>
                  <Text>{item.orange}</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text>Rouge</Text>
                  <Text>{item.red}</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text>Vert</Text>
                  <Text>{item.green}</Text>
                </View>
              </Row>
              <Row $justify="space-around" style={{ marginBottom: 10 }}>
                {hasRight("POINT", "UPDATE") && (
                  <Button
                    mode="contained-tonal"
                    icon="pencil"
                    onPress={() =>
                      navigation.navigate("updateScore", { idPoint: item.id })
                    }
                    style={{ borderRadius: 10 }}
                  >
                    Modifier
                  </Button>
                )}
                {hasRight("POINT", "DELETE") && (
                  <Button
                    mode="contained-tonal"
                    icon="delete"
                    onPress={() =>
                      Alert.alert(
                        "Suppression",
                        "Veux-tu vraiment supprimer ces points ?",
                        [
                          {
                            text: "Oui, supprimer",
                            onPress: () => deletePoint(item.id),
                          },
                          { text: "Annuler" },
                        ]
                      )
                    }
                    style={{ borderRadius: 10 }}
                  >
                    Supprimer
                  </Button>
                )}
              </Row>
            </View>
          );
        }}
      />
      {hasRight("POINT", "CREATE") && (
        <AnimatedFAB
          icon={"plus"}
          label={"Ajouter des points"}
          extended={isExtended}
          onPress={() => navigation.navigate("createScore")}
          visible={true}
          style={styles.fabStyle}
          variant="secondary"
        />
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  fabStyle: {
    bottom: 20,
    right: 16,
    position: "absolute",
  },
});
