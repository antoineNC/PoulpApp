import { useFont } from "@shopify/react-native-skia";
import { Container } from "@styledComponents";
import { FlatList, View } from "react-native";
import { CartesianChart, Bar } from "victory-native";
import inter from "@assets/fonts/inter-variable.ttf";
import { useCallback, useEffect, useState } from "react";
import { colors } from "@theme";
import { Divider } from "react-native-paper";
import { useUnit } from "effector-react";
import { $pointStore } from "@context/pointStore";
import { Text } from "@styledComponents";

export function ScoreScreen() {
  const listPoint = useUnit($pointStore);
  console.log(listPoint);
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
  const font = useFont(inter, 12);
  const getColor = useCallback((family: string) => {
    switch (family) {
      case "Rouge":
        return "red";
      case "Jaune":
        return "yellow";
      case "Bleu":
        return "blue";
      case "Orange":
        return "orange";
      case "Vert":
        return "green";
      default:
        break;
    }
  }, []);
  const maxScore = Math.max(...score.map((el) => el.score));

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
      { family: "Rouge", score: newScore.red },
      { family: "Jaune", score: newScore.yellow },
      { family: "Bleu", score: newScore.blue },
      { family: "Orange", score: newScore.orange },
      { family: "Vert", score: newScore.green },
    ]);
  }, [listPoint]);

  return (
    <Container>
      <View style={{ height: 250 }}>
        <CartesianChart
          data={score}
          xKey="family"
          yKeys={["score"]}
          xAxis={{ font, lineWidth: 0, labelColor: colors.white }}
          yAxis={[{ lineWidth: 0 }]}
          padding={10}
          domainPadding={{ left: 40, right: 40 }}
          domain={{ y: [0, maxScore + 5] }}
        >
          {({ points, chartBounds }) => {
            return points.score.map((point) => {
              return (
                <Bar
                  points={[point]}
                  chartBounds={chartBounds}
                  color={getColor(point.xValue.toString())}
                  roundedCorners={{ topLeft: 3, topRight: 3 }}
                  barWidth={60}
                  labels={{
                    font,
                    position: "top",
                    color: colors.white,
                  }}
                />
              );
            });
          }}
        </CartesianChart>
      </View>
      <Divider style={{ marginVertical: 20 }} />
      <FlatList
        data={listPoint}
        renderItem={({ item }) => (
          <View>
            <Text>TITRE : {item.title}</Text>
            <Text>BLEU : {item.blue}</Text>
            <Text>VERT : {item.green}</Text>
            <Text>ORANGE : {item.orange}</Text>
            <Text>ROUGE : {item.red}</Text>
            <Text>JAUNE : {item.yellow}</Text>
          </View>
        )}
      />
    </Container>
  );
}
