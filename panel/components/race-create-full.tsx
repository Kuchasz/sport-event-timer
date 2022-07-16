import { mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { useState } from "react";
import { Button } from "react-daisyui";
import { InferMutationInput, trpc } from "trpc";
import { RaceCreate } from "./race-create";
type CreatedRace = InferMutationInput<"race.add">;

export const RaceCreateFull = () => {
  const addRaceMuttaion = trpc.useMutation(["race.add"]);

  const [createVisible, setCreateVisible] = useState<boolean>(false);

  const toggleCreateVisible = () => {
    setCreateVisible(!createVisible);
  };

  const raceCreate = async (race: CreatedRace) => {
    await addRaceMuttaion.mutateAsync(race);
    toggleCreateVisible();
  };

  return (
    <>
      <Button onClick={toggleCreateVisible} startIcon={<Icon size={1} path={mdiPlus} />}>Create Race</Button>
      <RaceCreate
        isOpen={createVisible}
        onCancel={() => toggleCreateVisible()}
        onCreate={raceCreate}
      />
    </>
  );
};
