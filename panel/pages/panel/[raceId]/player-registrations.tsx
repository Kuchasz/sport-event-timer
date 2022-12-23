import DataGrid, { Column } from "react-data-grid";
import Head from "next/head";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { Confirmation } from "../../../components/confirmation";
import { Demodal } from "demodal";
import { AppRouterInputs, AppRouterOutputs } from "trpc";
import { trpc } from "../../../connection";
import { mdiPlus, mdiTrashCan } from "@mdi/js";
import { NiceModal } from "../../../components/modal";
import { useCurrentRaceId } from "../../../hooks";
import { PlayerRegistrationCreate } from "components/player-registration-create";
import { PlayerRegistrationEdit } from "components/player-registration-edit";

type PlayerRegistration = AppRouterOutputs["playerRegistration"]["registrations"][0];
type CreatedPlayerRegistration = AppRouterInputs["playerRegistration"]["add"]["player"];
type EditedPlayerRegistration = AppRouterInputs["playerRegistration"]["add"]["player"];

const columns: Column<PlayerRegistration, unknown>[] = [
    { key: "id", name: "Id", width: 10, sortable: false, resizable: false },
    { key: "name", name: "Name" },
    { key: "lastName", name: "Last Name" },
    {
        key: "gender",
        name: "Gender",
        width: 10
    },
    { key: "birthDate", name: "Birth Date", formatter: props => <div>{props.row.birthDate.toLocaleDateString()}</div> },
    { key: "country", name: "Country", width: 10 },
    { key: "city", name: "City" },
    { key: "team", name: "Team" },
    { key: "email", name: "Email" },
    { key: "phoneNumber", name: "Phone Number" },
    { key: "icePhoneNumber", name: "Ice Phone Number" },
    {
        key: "actions",
        width: 15,
        name: "Actions",
        formatter: props => <PlayerRegistrationDeleteButton playerRegistration={props.row} />
    }
];

const PlayerRegistrationDeleteButton = ({ playerRegistration }: { playerRegistration: PlayerRegistration }) => {
    const raceId = useCurrentRaceId();
    const { refetch } = trpc.playerRegistration.registrations.useQuery({ raceId: raceId! });
    const deletePlayerMutation = trpc.playerRegistration.delete.useMutation();
    const deletePlayer = async () => {
        const confirmed = await Demodal.open<boolean>(NiceModal, {
            title: `Delete player`,
            component: Confirmation,
            props: {
                message: `You are trying to delete the Player Registration ${playerRegistration.name} ${playerRegistration.lastName}. Do you want to proceed?`
            }
        });

        if (confirmed) {
            await deletePlayerMutation.mutateAsync({ playerId: playerRegistration.id });
            refetch();
        }
    };
    return (
        <span className="flex items-center hover:text-red-600 cursor-pointer" onClick={deletePlayer}>
            <Icon size={1} path={mdiTrashCan} />
            delete
        </span>
    );
};

const PlayerRegistrations = () => {
    const raceId = useCurrentRaceId();
    const { data: registrations, refetch } = trpc.playerRegistration.registrations.useQuery({ raceId: raceId! });
    const addPlayerRegistrationMutation = trpc.playerRegistration.add.useMutation();
    const editPlayerRegistrationMutation = trpc.playerRegistration.edit.useMutation();
    
    const openCreateDialog = async () => {
        const player = await Demodal.open<CreatedPlayerRegistration>(NiceModal, {
            title: "Create new player registration",
            component: PlayerRegistrationCreate,
            props: {
                raceId: raceId!
            }
        });

        if (player) {
            await addPlayerRegistrationMutation.mutateAsync({ raceId: raceId!, player });
            refetch();
        }
    };

    const openEditDialog = async (editedPlayerRegistration?: PlayerRegistration) => {
        const playerRegistration = await Demodal.open<EditedPlayerRegistration>(NiceModal, {
            title: "Edit player registration",
            component: PlayerRegistrationEdit,
            props: {
                raceId: raceId!,
                editedPlayer: editedPlayerRegistration
            }
        });

        if (playerRegistration) {
            await editPlayerRegistrationMutation.mutateAsync({ raceId: raceId!, player: playerRegistration });
            refetch();
        }
    };

    return (
        <>
            <Head>
                <title>Rejestracje zawodników</title>
            </Head>

            <div className="border-1 flex flex-col h-full border-gray-600 border-solid">
                <div className="mb-4 flex">
                    <Button onClick={openCreateDialog}>
                        <Icon size={1} path={mdiPlus} />
                    </Button>
                    <div className="px-1"></div>
                </div>
                {registrations && (
                    <DataGrid className='rdg-light h-full'
                        defaultColumnOptions={{
                            sortable: true,
                            resizable: true
                        }}
                        onRowDoubleClick={e => openEditDialog(e)}
                        columns={columns}
                        rows={registrations}
                    />
                )}
            </div>
        </>
    );
};

export default PlayerRegistrations;
