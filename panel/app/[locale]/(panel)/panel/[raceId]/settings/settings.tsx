"use client";
import { mdiPen, mdiPlus, mdiTrashCan } from "@mdi/js";
import Icon from "@mdi/react";
import { ApiKeyCreate } from "components/api-key-create";
import { ApiKeyEdit } from "components/api-key-edit";
import { Button } from "components/button";
import { Confirmation } from "components/confirmation";
import { NiceModal } from "components/modal";
import { trpc } from "trpc-core";
import { Demodal } from "demodal";
import { useCurrentRaceId } from "hooks";
import { AppRouterInputs, AppRouterOutputs } from "trpc";
import Head from "next/head";
import { PageHeader } from "components/page-header";
import { useTranslations } from "next-intl";

type EditedApiKey = AppRouterInputs["apiKey"]["addApiKey"]["key"];
type ApiKey = AppRouterOutputs["apiKey"]["list"][0];

export const Settings = () => {
    const raceId = useCurrentRaceId();

    const { data: apiKeys, refetch } = trpc.apiKey.list.useQuery({ raceId: raceId! });
    const addKeyMutation = trpc.apiKey.addApiKey.useMutation();
    const deleteApiKeyMutation = trpc.apiKey.removeApiKey.useMutation();
    const editApiKeyMutation = trpc.apiKey.editApiKey.useMutation();
    const t = useTranslations();

    const openCreateDialog = async () => {
        const apiKey = await Demodal.open<EditedApiKey>(NiceModal, {
            title: t('pages.settings.apiKeys.create.title'),
            component: ApiKeyCreate,
            props: {
                raceId: raceId!,
            },
        });

        if (apiKey) {
            await addKeyMutation.mutateAsync({ raceId: raceId!, key: apiKey });
            refetch();
        }
    };

    const openDeleteDialog = async (apiKey: ApiKey) => {
        const confirmed = await Demodal.open<boolean>(NiceModal, {
            title: t('pages.settings.apiKeys.delete.confirmation.title'),
            component: Confirmation,
            props: {
                message: t('pages.settings.apiKeys.delete.confirmation.text', {name: apiKey.name}),
            },
        });

        if (confirmed) {
            await deleteApiKeyMutation.mutateAsync({ raceId: apiKey.raceId, keyId: apiKey.id });
            refetch();
        }
    };

    const openEditDialog = async (editedApiKey?: ApiKey) => {
        const key = await Demodal.open<ApiKey>(NiceModal, {
            title: t('pages.settings.apiKeys.edit.title'),
            component: ApiKeyEdit,
            props: {
                raceId: raceId!,
                editedApiKey,
            },
        });

        if (key) {
            await editApiKeyMutation.mutateAsync({ raceId: raceId!, key });
            refetch();
        }
    };

    return (
        <>
            <Head>
                <title>{t('pages.settings.header.title')}</title>
            </Head>
            <div className="border-1 flex flex-col h-full border-gray-600 border-solid">
                <PageHeader title={t('pages.settings.header.title')} description={t('pages.settings.header.description')} />
                <div className="mb-4 flex">
                    <Button outline onClick={openCreateDialog}>
                        <Icon size={1} path={mdiPlus} />
                        <span className="ml-2">{t('pages.settings.apiKeys.create.button')}</span>
                    </Button>
                </div>
                {apiKeys &&
                    apiKeys.map(key => (
                        <div key={key.key} className="flex flex-col">
                            <div>{key.name}</div>
                            <div className="flex items-center">
                                <div className="my-2 mr-2 bg-[#c2e59c] rounded-md px-4 py-2">{key.key}</div>
                                <Button className="mr-2" onClick={() => openEditDialog(key)}>
                                    <Icon size={1} path={mdiPen} />
                                </Button>
                                <Button onClick={() => openDeleteDialog(key)}>
                                    <Icon size={1} path={mdiTrashCan} />
                                </Button>
                            </div>
                        </div>
                    ))}
            </div>
        </>
    );
};
