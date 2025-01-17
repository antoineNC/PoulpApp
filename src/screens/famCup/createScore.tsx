import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { createPoint } from "@fb/service/point.service";
import { CreateScoreProps } from "@navigation/navigationTypes";
import { PointsFormFields } from "types/point.type";
import { handleError } from "utils/errorUtils";
import { notificationToast } from "utils/toast";
import { ScoreForm } from "./scoreForm";

export default function CreateScoreScreen({ navigation }: CreateScoreProps) {
  const [loading, setLoading] = useState(false);
  const formParams = useForm<PointsFormFields>({
    defaultValues: {
      date: new Date(),
      title: "",
      blue: 0,
      yellow: 0,
      orange: 0,
      red: 0,
      green: 0,
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
      await createPoint(formattedData);
      notificationToast("success", "Score créé avec succès.");
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
