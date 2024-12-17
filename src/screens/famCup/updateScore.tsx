import { useState } from "react";
import { useForm } from "react-hook-form";
import { UpdateScoreProps } from "@navigation/navigationTypes";
import { useStoreMap } from "effector-react";
import { $pointStore } from "@context/pointStore";
import { PointsFormFields } from "types/point.type";
import { updatePoint } from "@fb/service/point.service";
import React from "react";
import { ScoreForm } from "./scoreForm";

export default function UpdateScoreScreen({
  navigation,
  route,
}: UpdateScoreProps) {
  const { idPoint } = route.params;
  const point = useStoreMap({
    store: $pointStore,
    keys: [idPoint],
    fn: (pointList) => pointList.find((point) => point.id === idPoint),
  });
  const [loading, setLoading] = useState(false);

  const formParams = useForm<PointsFormFields>({
    defaultValues: {
      ...point,
    },
  });

  const onSubmit = async (data: PointsFormFields) => {
    try {
      const formattedData: PointsFormFields = {
        title: data.title,
        date: data.date,
        blue: Number(data.blue),
        yellow: Number(data.yellow),
        orange: Number(data.orange),
        red: Number(data.red),
        green: Number(data.green),
      };
      setLoading(true);
      await updatePoint(formattedData, idPoint);
    } catch (e) {
      throw new Error("[update score]: " + e);
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  };

  return (
    <ScoreForm formParams={formParams} loading={loading} onSubmit={onSubmit} />
  );
}
