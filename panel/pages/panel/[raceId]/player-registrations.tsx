import DataGrid, { Column } from "react-data-grid";
import Head from "next/head";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { Confirmation } from "../../../components/confirmation";
import { Demodal } from "demodal";
import { AppRouterInputs, AppRouterOutputs } from "trpc";
import { trpc } from "../../../connection";
import { mdiAccountPlusOutline, mdiCashCheck, mdiCashRemove, mdiPlus, mdiTrashCan } from "@mdi/js";
import { NiceModal } from "../../../components/modal";
import { useCurrentRaceId } from "../../../hooks";
import { PlayerRegistrationCreate } from "components/player-registration-create";
import { PlayerRegistrationEdit } from "components/player-registration-edit";
import { PlayerRegistrationPromotion } from "components/player-registration-promotion";
import classNames from "classnames";

type PlayerRegistration = AppRouterOutputs["playerRegistration"]["registrations"][0];
type CreatedPlayerRegistration = AppRouterInputs["playerRegistration"]["add"]["player"];
type EditedPlayerRegistration = AppRouterInputs["playerRegistration"]["add"]["player"];
type PlayerRegistrationPromotion = AppRouterInputs["player"]["promoteRegistration"]["player"];

const columns: Column<PlayerRegistration, unknown>[] = [
    { key: "index", name: "", sortable: false, resizable: false, width: 5 },
    { key: "name", name: "Name" },
    { key: "lastName", name: "Last Name" },
    {
        key: "gender",
        name: "Gender",
        width: 10,
    },
    { key: "birthDate", name: "Birth Date", width: 30, formatter: props => <div>{props.row.birthDate.toLocaleDateString()}</div> },
    { key: "country", name: "Country", width: 10 },
    { key: "city", name: "City", width: 20 },
    { key: "team", name: "Team", formatter: props => <div className="text-ellipsis">{props.row.team}</div> },

    { key: "phoneNumber", name: "Phone", width: 20 },
    { key: "icePhoneNumber", name: "ICE Number", width: 20 },
    {
        key: "registrationDate",
        name: "Registration Date",
        width: 30,
        formatter: props => <div>{props.row.registrationDate.toLocaleDateString()}</div>,
    },
    { key: "paymentDate", name: "Payment", width: 150, formatter: props => <PlayerRegistrationPayment playerRegistration={props.row} /> },
    {
        key: "actions",
        width: 50,
        name: "Actions",
        formatter: props => <PlayerRegistrationActions playerRegistration={props.row} />,
    },
];

const PlayerRegistrationPayment = ({ playerRegistration }: { playerRegistration: PlayerRegistration }) => {
    const raceId = useCurrentRaceId();
    const { refetch } = trpc.playerRegistration.registrations.useQuery({ raceId: raceId! });
    const setPaymentStatusMutation = trpc.playerRegistration.setPaymentStatus.useMutation();

    const togglePlayerPayment = async () => {
        const confirmed = await Demodal.open<boolean>(NiceModal, {
            title: `Confirm payment change`,
            component: Confirmation,
            props: {
                message: `You are trying to change ${playerRegistration.name} ${playerRegistration.lastName} payment status to: ${
                    playerRegistration.hasPaid ? "not paid" : "paid"
                }. Do you want to proceed?`,
            },
        });

        if (confirmed) {
            await setPaymentStatusMutation.mutateAsync({ playerId: playerRegistration.id, hasPaid: !playerRegistration.hasPaid });
            refetch();
        }
    };
    return (
        <span
            className={classNames("flex h-full items-center hover:text-black cursor-pointer", {
                ["text-green-600 font-semibold"]: playerRegistration.paymentDate !== null,
                ["text-red-600"]: playerRegistration.paymentDate === null,
            })}
            onClick={togglePlayerPayment}
        >
            {playerRegistration.hasPaid ? <Icon size={1} path={mdiCashCheck} /> : <Icon size={1} path={mdiCashRemove} />}
            <span className="ml-2">{playerRegistration.paymentDate?.toLocaleDateString() ?? "not paid"}</span>
        </span>
    );
};

const PlayerRegistrationActions = ({ playerRegistration }: { playerRegistration: PlayerRegistration }) => {
    const raceId = useCurrentRaceId();
    const { refetch } = trpc.playerRegistration.registrations.useQuery({ raceId: raceId! });
    const deletePlayerMutation = trpc.playerRegistration.delete.useMutation();
    const promotePlayerRegistration = trpc.player.promoteRegistration.useMutation();
    const utils = trpc.useContext();

    const openDeleteDialog = async () => {
        const confirmed = await Demodal.open<boolean>(NiceModal, {
            title: `Delete player registration`,
            component: Confirmation,
            props: {
                message: `You are trying to delete the Player Registration ${playerRegistration.name} ${playerRegistration.lastName}. Do you want to proceed?`,
            },
        });

        if (confirmed) {
            await deletePlayerMutation.mutateAsync({ playerId: playerRegistration.id });
            refetch();
        }
    };

    const openPromoteMutation = async () => {
        const player = await Demodal.open<PlayerRegistrationPromotion>(NiceModal, {
            title: "Promote player registration to player",
            component: PlayerRegistrationPromotion,
            props: {
                raceId: raceId!,
            },
        });

        if (player) {
            await promotePlayerRegistration.mutateAsync({ raceId: raceId!, registrationId: playerRegistration.id, player });

            utils.player.lastAvailableBibNumber.invalidate({ raceId: raceId! });
            utils.player.lastAvailableStartTime.invalidate({ raceId: raceId! });

            refetch();
        }
    };

    return (
        <span className="flex">
            <span className="flex px-2 items-center hover:text-red-600 cursor-pointer" onClick={openPromoteMutation}>
                <Icon size={1} path={mdiAccountPlusOutline} />
            </span>
            <span className="flex px-2 items-center hover:text-red-600 cursor-pointer" onClick={openDeleteDialog}>
                <Icon size={1} path={mdiTrashCan} />
            </span>
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
                raceId: raceId!,
            },
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
                editedPlayerRegistration,
            },
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
                    <DataGrid
                        className="rdg-light h-full"
                        defaultColumnOptions={{
                            sortable: false,
                            resizable: true,
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

export { getSecuredServerSideProps as getServerSideProps } from "../../../auth";
