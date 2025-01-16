import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useStoreMap } from "effector-react";

import { updatePoint } from "@fb/service/point.service";
import { UpdateScoreProps } from "@navigation/navigationTypes";
import { $pointStore } from "@context/pointStore";
import { PointsFormFields } from "types/point.type";
import { handleError } from "utils/errorUtils";
import { notificationToast } from "utils/toast";
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
      notificationToast("success", "Score mis à jour.");
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  };

  return (
    <ScoreForm formParams={formParams} loading={loading} onSubmit={onSubmit} />
  );
}
