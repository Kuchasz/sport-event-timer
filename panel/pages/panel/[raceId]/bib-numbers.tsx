import DataGrid, { Column } from "react-data-grid";
import Head from "next/head";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { BibNumberCreate } from "components/bib-number-create";
import { BibNumberEdit } from "components/bib-number-edit";
import { Demodal } from "demodal";
import { trpc } from "../../../connection";
import { mdiPlus, mdiTrashCan } from "@mdi/js";
import { NiceModal } from "components/modal";
import { useCurrentRaceId } from "../../../hooks";
import { useMemo } from "react";
import { AppRouterInputs, AppRouterOutputs } from "../../../trpc";
import { Confirmation } from "components/confirmation";

type BibNumber = AppRouterOutputs["bibNumber"]["numbers"][0];
type EditedBibNumber = AppRouterInputs["bibNumber"]["update"];
type CreatedBibNumber = AppRouterInputs["bibNumber"]["add"];

const columns: Column<BibNumber, unknown>[] = [
    { key: "index", name: "", width: 10 },
    { key: "number", name: "Bib Number" },
    {
        key: "actions",
        width: 15,
        name: "Actions",
        formatter: props => <BibNumberDeleteButton bibNumber={props.row} />
    }
];

const BibNumberDeleteButton = ({ bibNumber }: { bibNumber: BibNumber }) => {
    const raceId = useCurrentRaceId();
    const { refetch } = trpc.bibNumber.numbers.useQuery({ raceId: raceId! });
    const deletebibNumberMutation = trpc.bibNumber.delete.useMutation();
    const deletebibNumber = async () => {
        const confirmed = await Demodal.open<boolean>(NiceModal, {
            title: `Delete bibNumber`,
            component: Confirmation,
            props: {
                message: `You are trying to delete the Bib Number ${bibNumber.number}. Do you want to proceed?`
            }
        });

        if (confirmed) {
            await deletebibNumberMutation.mutateAsync({ bibNumberId: bibNumber.id });
            refetch();
        }
    };
    return (
        <span className="flex items-center hover:text-red-600 cursor-pointer" onClick={deletebibNumber}>
            <Icon size={1} path={mdiTrashCan} />
            delete
        </span>
    );
};

const BibNumbers = () => {
    const raceId = useCurrentRaceId();
    const { data: bibNubers, refetch } = trpc.bibNumber.numbers.useQuery({ raceId: raceId! });
    const updatebibNumberMutation = trpc.bibNumber.update.useMutation();
    const addClassifiationMutation = trpc.bibNumber.add.useMutation();

    const sortedbibNumbers = useMemo((): readonly BibNumber[] => {
        if (!bibNubers) return [];

        return [...bibNubers];
    }, [bibNubers]);

    const openCreateDialog = async () => {
        const bibNumber = await Demodal.open<CreatedBibNumber>(NiceModal, {
            title: "Create new BibNumber",
            component: BibNumberCreate,
            props: { raceId: raceId! },
        });

        if (bibNumber) {
            await addClassifiationMutation.mutateAsync(bibNumber);
            refetch();
        }
    };

    const openEditDialog = async (editedbibNumber?: BibNumber) => {
        const bibNumber = await Demodal.open<EditedBibNumber>(NiceModal, {
            title: "Edit BibNumber",
            component: BibNumberEdit,
            props: {
                editedbibNumber,
            },
        });

        if (bibNumber) {
            await updatebibNumberMutation.mutateAsync(bibNumber);
            refetch();
        }
    };

    return (
        <>
            <Head>
                <title>Bib Numbers</title>
            </Head>
            <div className="border-1 flex flex-col h-full border-gray-600 border-solid">
                <div className="mb-4 inline-flex">
                    <Button onClick={openCreateDialog}>
                        <Icon size={1} path={mdiPlus} />
                    </Button>
                </div>
                <DataGrid
                    className="rdg-light h-full"
                    defaultColumnOptions={{
                        sortable: false,
                        resizable: true,
                    }}
                    onRowDoubleClick={e => openEditDialog(e)}
                    columns={columns}
                    rows={sortedbibNumbers}
                />
            </div>
        </>
    );
};

export default BibNumbers;

export { getSecuredServerSideProps as getServerSideProps } from "../../../auth";
