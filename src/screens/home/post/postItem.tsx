import React, { useCallback, useEffect, useState } from "react";
import {
  NativeSyntheticEvent,
  TextLayoutEventData,
  TouchableOpacity,
  View,
} from "react-native";
import { useStoreMap } from "effector-react";
import { Button, Icon } from "react-native-paper";
import ImageView from "react-native-image-viewing";
import { Image, Row } from "@styledComponents";
import { displayDate } from "utils/dateUtils";
import { useRight } from "utils/rights";
import { $officeStore } from "@context/officeStore";
import { useDialog } from "@context/dialog/dialogContext";
import { PostItemProps } from "types/post.type";
import { DateType } from "types/date.type";
import { BodyText, LinkText, TitleText } from "components/customText";
import { calendar, pencil, trash } from "components/icon/icons";

// TODO : move to components
export const PostItem = ({
  post,
  onPressOffice,
  onPressCalendar,
  onPressUpdate,
  onPressDelete,
}: PostItemProps) => {
  const { hasRight } = useRight();
  const { showDialog } = useDialog();
  const [date, setDate] = useState<DateType>({});
  const [allDay, setAllDay] = useState(false);
  const [textShown, setTextShown] = useState(false);
  const [lengthMore, setLengthMore] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const office = useStoreMap({
    store: $officeStore,
    keys: [post.id],
    fn: (officeStore) =>
      officeStore.officeList.find((office) => office.id === post.editorId),
  });

  useEffect(() => {
    if (post.date?.start) {
      const { startDate, endDate } = displayDate({
        start: post.date.start,
        end: post.date.end,
      });
      setDate({ start: startDate, end: endDate });
      setAllDay(!post.date.end);
    }
  }, [post]);

  const onTextLayout = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      setLengthMore(e.nativeEvent.lines.length > 3);
    },
    []
  );
  const toggleNumberOfLines = () => {
    setTextShown((value) => !value);
  };

  const onOffice = () => office && onPressOffice(office.id);
  const onCalendar = () => onPressCalendar();
  const onUpdate = () => onPressUpdate();
  const onDelete = () => onPressDelete();

  return (
    <View style={{ rowGap: 15 }}>
      <View
        style={{
          paddingHorizontal: 15,
          rowGap: 15,
        }}
      >
        <Row>
          <TouchableOpacity onPress={onOffice}>
            <Image source={{ uri: office?.logoUrl }} $size={50} />
          </TouchableOpacity>
          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <TitleText>{post.title}</TitleText>
            <Row style={{ flexWrap: "wrap" }}>
              {post.tags &&
                post.tags.map((value, index) => (
                  <BodyText key={index}>[{value}] </BodyText>
                ))}
            </Row>
          </View>
        </Row>
        {date.start && (
          <TouchableOpacity onPress={onCalendar} style={{ marginVertical: 5 }}>
            <Row style={{ columnGap: 10 }}>
              <Icon source={calendar} size={20} />
              <View>
                {allDay ? (
                  <LinkText>{date.start} (toute la journée)</LinkText>
                ) : (
                  <>
                    <LinkText>Du : {date.start}</LinkText>
                    <LinkText>au : {date.end}</LinkText>
                  </>
                )}
              </View>
            </Row>
          </TouchableOpacity>
        )}
        {post.description && (
          <TouchableOpacity
            onPress={toggleNumberOfLines}
            disabled={!lengthMore}
          >
            <BodyText
              onTextLayout={onTextLayout}
              numberOfLines={textShown ? undefined : 3}
            >
              {post.description}
            </BodyText>
            {lengthMore && (
              <LinkText>{textShown ? "Voir moins" : "Voir plus"}</LinkText>
            )}
          </TouchableOpacity>
        )}
      </View>
      {post.imageUrl && (
        <View>
          <TouchableOpacity onPress={() => setShowImage(true)}>
            <Image source={{ uri: post.imageUrl }} />
          </TouchableOpacity>
          <ImageView
            images={[{ uri: post.imageUrl }]}
            imageIndex={0}
            visible={showImage}
            onRequestClose={() => setShowImage(false)}
          />
        </View>
      )}
      <Row $justify="space-around">
        {hasRight("POST", "UPDATE", office?.id) && (
          <Button mode="contained-tonal" icon={pencil} onPress={onUpdate}>
            Modifier
          </Button>
        )}
        {hasRight("POST", "DELETE", office?.id) && (
          <Button
            mode="contained-tonal"
            icon={trash}
            onPress={() =>
              showDialog({
                title: "Suppression",
                message: "Veux-tu vraiment supprimer ce post ?",
                buttons: [
                  {
                    text: "Oui, supprimer",
                    onPress: onDelete,
                  },
                  { text: "Annuler" },
                ],
              })
            }
          >
            Supprimer
          </Button>
        )}
      </Row>
    </View>
  );
};
