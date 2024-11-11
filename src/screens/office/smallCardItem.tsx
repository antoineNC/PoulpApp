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
        source={{ uri: logo }}
        resizeMode="contain"
        style={{
          margin: 5,
          borderRadius: 5,
          alignSelf: "center",
          height: 150,
          width: 150,
          backgroundColor: "transparent",
        }}
      />
      <Card.Title title={title} />
      <Card.Actions>
        <IconButton icon="pencil" onPress={onEdit} />
        <IconButton icon="delete" onPress={onDelete} />
      </Card.Actions>
    </Card>
  );
};
