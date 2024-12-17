import { Card, IconButton } from "react-native-paper";

export const SmallCardItem = ({
  title,
  logo,
  onEdit,
  onDelete,
}: {
  title: string;
  logo?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}) => {
  return (
    <Card>
      <Card.Cover
        source={
          logo
            ? {
                uri: logo,
              }
            : require("@assets/no_image_available.png")
        }
        resizeMode="contain"
        style={{
          margin: 5,
          alignSelf: "center",
          height: 150,
          width: 150,
          backgroundColor: "transparent",
        }}
      />
      <Card.Title title={title} />
      <Card.Actions>
        {onEdit && <IconButton icon="pencil" onPress={onEdit} />}
        {onDelete && <IconButton icon="delete" onPress={onDelete} />}
      </Card.Actions>
    </Card>
  );
};
