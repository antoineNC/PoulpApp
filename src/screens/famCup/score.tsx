import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useUnit } from "effector-react";
import {
  AnimatedFAB,
  Divider,
  Icon,
  IconButton,
  useTheme,
} from "react-native-paper";
import { CartesianChart, Bar } from "victory-native";
import { useFont } from "@shopify/react-native-skia";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";

import inter from "@assets/fonts/inter-variable.ttf";
import { deletePoint } from "@fb/service/point.service";
import { ScoreProps } from "@navigation/navigationTypes";
import { $pointStore } from "@context/pointStore";
import { Container, Row } from "@styledComponents";
import { BodyText, TitleText } from "components/customText";
import { dotsVertical, pencil, plus, trash } from "components/icon/icons";
import { formatDay } from "utils/dateUtils";
import { useRight } from "utils/rights";
import { notificationToast } from "utils/toast";
import { handleError } from "utils/errorUtils";

export default function ScoreScreen({ navigation }: ScoreProps) {
  const listPoint = useUnit($pointStore);
  const { colors } = useTheme();
  const { hasRight } = useRight();
  const font = useFont(inter, 12);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [scoreId, setScoreId] = useState<string | null>(null);
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

  const onDelete = () => {
    if (!scoreId) return;
    Alert.alert("Suppression", "Veux-tu vraiment supprimer ces points ?", [
      {
        text: "Oui, supprimer",
        onPress: async () => {
          try {
            await deletePoint(scoreId);
            notificationToast("success", "Points supprimés.");
          } catch (e) {
            handleError(e);
          }
        },
      },
      { text: "Annuler" },
    ]);
  };

  const onUpdate = () => {
    if (!scoreId) return;
    navigation.navigate("updateScore", { idPoint: scoreId });
    bottomSheetRef.current?.close();
  };

  const renderBackdrop = useCallback(
    (
      props: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps
    ) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

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
            labelColor: colors.onBackground,
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
                  color: colors.onBackground,
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
        contentContainerStyle={{
          rowGap: 10,
          marginHorizontal: 10,
          paddingTop: 10,
        }}
        ItemSeparatorComponent={() => <Divider />}
        ListFooterComponent={<View style={{ marginVertical: 40 }} />}
        renderItem={({ item, index }) => {
          const date = formatDay(item.date);
          return (
            <View key={index} style={{ paddingHorizontal: 15 }}>
              <Row>
                <View style={{ flex: 1 }}>
                  <TitleText>{item.title}</TitleText>
                  <BodyText>{date}</BodyText>
                </View>
                {hasRight("POINT", "DELETE") && (
                  <IconButton
                    icon={dotsVertical}
                    size={20}
                    onPress={() => {
                      setScoreId(item.id);
                      bottomSheetRef.current?.expand();
                    }}
                  />
                )}
              </Row>
              <Row $justify="space-between" $padding="10px 0">
                <View style={{ alignItems: "center" }}>
                  <BodyText>Bleu</BodyText>
                  <BodyText>{item.blue}</BodyText>
                </View>
                <View style={{ alignItems: "center" }}>
                  <BodyText>Jaune</BodyText>
                  <BodyText>{item.yellow}</BodyText>
                </View>
                <View style={{ alignItems: "center" }}>
                  <BodyText>Orange</BodyText>
                  <BodyText>{item.orange}</BodyText>
                </View>
                <View style={{ alignItems: "center" }}>
                  <BodyText>Rouge</BodyText>
                  <BodyText>{item.red}</BodyText>
                </View>
                <View style={{ alignItems: "center" }}>
                  <BodyText>Vert</BodyText>
                  <BodyText>{item.green}</BodyText>
                </View>
              </Row>
            </View>
          );
        }}
      />
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        containerStyle={{ zIndex: 1 }}
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.primary }}
      >
        <BottomSheetView>
          <TouchableOpacity onPress={onUpdate}>
            <Row
              style={{
                margin: 20,
                columnGap: 10,
              }}
            >
              <Icon size={20} source={pencil} />
              <TitleText>Modifier</TitleText>
            </Row>
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity onPress={onDelete}>
            <Row
              style={{
                margin: 20,
                columnGap: 10,
              }}
            >
              <Icon size={20} source={trash} />
              <TitleText>Supprimer</TitleText>
            </Row>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
      {hasRight("POINT", "CREATE") && (
        <AnimatedFAB
          icon={plus}
          label={"Ajouter des points"}
          extended={isExtended}
          onPress={() => navigation.navigate("createScore")}
          visible={true}
          style={styles.fabStyle}
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
