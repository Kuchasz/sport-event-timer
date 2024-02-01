"use client";
import { mdiPen, mdiPlus, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { PageHeader } from "components/page-headers";
import { ApiKeyCreate } from "components/panel/api-key/api-key-create";
import { ApiKeyEdit } from "components/panel/api-key/api-key-edit";
import { PoorConfirmation, PoorModal } from "components/poor-modal";
import { useCurrentRaceId } from "hooks";
import { useTranslations } from "next-intl";
import Head from "next/head";
import type { AppRouterOutputs } from "trpc";
import { trpc } from "trpc-core";

type ApiKey = AppRouterOutputs["apiKey"]["list"][0];

export const Settings = () => {
    const raceId = useCurrentRaceId();

    const { data: apiKeys, refetch } = trpc.apiKey.list.useQuery({ raceId: raceId });
    const deleteApiKeyMutation = trpc.apiKey.removeApiKey.useMutation();

    const t = useTranslations();

    const deleteApiKey = async (apiKey: ApiKey) => {
        await deleteApiKeyMutation.mutateAsync({ raceId: apiKey.raceId, keyId: apiKey.id });
        void refetch();
    };

    return (
        <>
            <Head>
                <title>{t("pages.settings.header.title")}</title>
            </Head>
            <div className="border-1 flex h-full flex-col border-solid border-gray-600">
                <PageHeader title={t("pages.settings.header.title")} description={t("pages.settings.header.description")} />
                <div className="mb-4 flex">
                    <PoorModal
                        onResolve={() => refetch()}
                        title={t("pages.settings.apiKeys.create.title")}
                        component={ApiKeyCreate}
                        componentProps={{
                            raceId: raceId,
                            onReject: () => {},
                        }}>
                        <Button outline>
                            <Icon size={0.8} path={mdiPlus} />
                            <span className="ml-2">{t("pages.settings.apiKeys.create.button")}</span>
                        </Button>
                    </PoorModal>
                </div>
                {apiKeys?.map(key => (
                    <div key={key.key} className="flex flex-col">
                        <div>{key.name}</div>
                        <div className="flex items-center">
                            <div className="my-2 mr-2 rounded-md bg-[#c2e59c] px-4 py-2">{key.key}</div>
                            <PoorModal
                                onResolve={() => refetch()}
                                title={t("pages.settings.apiKeys.edit.title")}
                                component={ApiKeyEdit}
                                componentProps={{
                                    raceId: raceId,
                                    editedApiKey: key,
                                    onReject: () => {},
                                }}>
                                <Button className="mr-2">
                                    <Icon size={0.8} path={mdiPen} />
                                </Button>
                            </PoorModal>

                            <PoorConfirmation
                                title={t("pages.settings.apiKeys.delete.confirmation.title")}
                                message={t("pages.settings.apiKeys.delete.confirmation.text", { name: key.name })}
                                onAccept={() => deleteApiKey(key)}
                                isLoading={deleteApiKeyMutation.isLoading}>
                                <Button>
                                    <Icon size={0.8} path={mdiTrashCanOutline} />
                                </Button>
                            </PoorConfirmation>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
