import { useState } from "react";
import { StyledSwitch } from "./Switch.styles";
import { Box, SwitchProps as MUISwitchProps } from "@mui/material";
import useApi from "../../Hooks/useApi";
import { LoadingAPI } from "../../Components/LoadingApi/LoadingApi";

const apiKey: string = import.meta.env.VITE_GPT_KEY as string;
type SwitchProps = MUISwitchProps;

export const Switch = (props: SwitchProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const { callApi, isLoading } = useApi(apiKey);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckedState = event.target.checked;

    setIsChecked(newCheckedState);

    if (newCheckedState) {
      callApi(prompt);
    }
  };

  const prompt = `
  Tworzę stronę, która ma być zbiorowiskiem innych stron oferujących gotowe rozwiązania AI. Potrzebuję pliku JSON, który zawierałby takie informacje.
  Stwórz 6 kategorię, do których można by przypisać strony.
  Do każdej kategorii przypisz 3 strony.
  Kategoria powinna zawierać:
  id - id kategorii, jako cyfra
  name - nazwę kategorii,
  color - kolor kategorii w stylu pastelowym, ciemny lub jasny
  imageUrl - link do zdjęcia tematycznego odwzorowującego nazwę kategorii
  products - tabelę produktów
  
  Element tabeli products powinien wyglądać tak:
  id - id produktu, jako cyfra
  name - nazwa produktu,
  website - link do strony produktu,
  license - typ licensji, "Darmowa" lub "Płatna",
  youtubeUrl - link do filmu na platformie YouTube, który pokazuje działanie strony
  description - opis strony
  Stwórz JSON w tym formacie:
  [
    "id" : 1,
    "name": "Produktywność",
    "color": "#123423",
    "imageUrl" : "https://themamamanual.files.wordpress.com/2011/08/cow.jpg",
    "products" : [
      {
        "id" : 1,
        "name": "TensorFlow",
        "website": "https://www.tensorflow.org/",
        "license": "darmowa",
        "youtubeUrl": "https://www.youtube.com/watch?v=tPYj3fFJGjk",
        "description": "Platforma do uczenia maszynowego stworzona przez Google."
      },
      {
        "id" : 2,
        "name": "OpenAI",
        "website": "https://www.openai.com/",
        "license": "darmowa",
        "youtubeUrl": "https://www.youtube.com/watch?v=Rykmwn0SMWU",
        "description": "Organizacja zajmująca się sztuczną inteligencją."
        },
    ]
  ]
`;

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      {isLoading ? <LoadingAPI /> : null}
      <StyledSwitch {...props} checked={isChecked} onChange={handleSwitchChange} />
    </Box>
  );
};
