"use client";
import { mdiPen, mdiPlus, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { PoorButton } from "src/components/poor-button";
import { PageHeader } from "src/components/page-headers";
import { ApiKeyCreate } from "src/components/panel/api-key/api-key-create";
import { ApiKeyEdit } from "src/components/panel/api-key/api-key-edit";
import { PoorConfirmation, PoorModal } from "src/components/poor-modal";
import { useCurrentRaceId } from "src/hooks";
import { useTranslations } from "next-intl";
import Head from "next/head";
import type { AppRouterOutputs } from "src/trpc";
import { trpc } from "src/trpc-core";

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
                        <PoorButton outline>
                            <Icon size={0.8} path={mdiPlus} />
                            <span className="ml-2">{t("pages.settings.apiKeys.create.button")}</span>
                        </PoorButton>
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
                                <PoorButton className="mr-2">
                                    <Icon size={0.8} path={mdiPen} />
                                </PoorButton>
                            </PoorModal>

                            <PoorConfirmation
                                destructive
                                title={t("pages.settings.apiKeys.delete.confirmation.title")}
                                message={t("pages.settings.apiKeys.delete.confirmation.text", { name: key.name })}
                                onAccept={() => deleteApiKey(key)}
                                isLoading={deleteApiKeyMutation.isLoading}>
                                <PoorButton>
                                    <Icon size={0.8} path={mdiTrashCanOutline} />
                                </PoorButton>
                            </PoorConfirmation>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
