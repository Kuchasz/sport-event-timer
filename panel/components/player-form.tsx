import { Button } from "./button";
import { AppRouterInputs, AppRouterOutputs } from "trpc";
import { PoorDatepicker } from "./poor-datepicker";
import { PoorInput } from "./poor-input";
import { PoorSelect } from "./poor-select";
import { PoorTimepicker } from "./poor-timepicker";
import { useCurrentRaceId } from "hooks";
import { PoorCombo } from "./poor-combo";
import { genders } from "@set/utils/dist/gender";
import { Form, FormInput } from "form";
import { playerSchema } from "modules/player/models";
import { trpc } from "trpc-core";
import { countryCodes } from "contry-codes";
import { useTranslations } from "next-intl";

type Player = AppRouterInputs["player"]["add"]["player"];

type PlayerFormProps = {
    onReject: () => void;
    onResolve: (player: Player) => void;
    initialPlayer: Player;
    classifications: AppRouterOutputs["classification"]["classifications"];
    bibNumbers: string[];
};

export const PlayerForm = ({ onReject, onResolve, initialPlayer, classifications, bibNumbers }: PlayerFormProps) => {
    const raceId = useCurrentRaceId();
    const { data: teams } = trpc.playerRegistration.teams.useQuery({ raceId: Number(raceId) }, { enabled: !!raceId, initialData: [] });
    const t = useTranslations();

    return (
        <Form<Player> initialValues={initialPlayer} validationSchema={playerSchema} onSubmit={onResolve}>
            <div className="flex">
                <FormInput<Player, "classificationId">
                    label={t('pages.players.form.classification.label')}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorSelect
                            initialValue={value}
                            items={classifications}
                            placeholder={t('pages.players.form.classification.placeholder')}
                            nameKey="name"
                            valueKey="id"
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        ></PoorSelect>
                    )}
                    name="classificationId"
                />
                <div className="p-2"></div>
                <FormInput<Player, "bibNumber">
                    label={t('pages.players.form.bibNumber.label')}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorCombo
                            initialValue={value}
                            placeholder={t('pages.players.form.bibNumber.placeholder')}
                            items={bibNumbers}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="bibNumber"
                />
            </div>
            <div className="flex">
                <FormInput<Player, "name">
                    label={t('pages.players.form.name.label')}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t('pages.players.form.name.placeholder')} value={value} onChange={e => onChange({ target: { value: e.target.value } })} />
                    )}
                    name="name"
                />
                <div className="p-2"></div>
                <FormInput<Player, "lastName">
                    label={t('pages.players.form.lastName.label')}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t('pages.players.form.lastName.placeholder')} value={value} onChange={e => onChange({ target: { value: e.target.value } })} />
                    )}
                    name="lastName"
                />
            </div>
            <div className="flex">
                <FormInput<Player, "gender">
                    label={t('pages.players.form.gender.label')}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorSelect
                            initialValue={value}
                            items={genders}
                            placeholder={t('pages.players.form.gender.placeholder')}
                            nameKey="name"
                            valueKey="value"
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="gender"
                />
                <div className="p-2"></div>
                <FormInput<Player, "birthDate">
                    label={t('registration.fields.birthDate.label')}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorDatepicker
                            placeholder={t('pages.players.form.birthDate.placeholder')}
                            value={value}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="birthDate"
                />
            </div>
            <div>
                <FormInput<Player, "team">
                    label={t('pages.players.form.team.label')}
                    render={({ value, onChange }) => (
                        <PoorCombo
                            placeholder={t('pages.players.form.team.placeholder')}
                            initialValue={value}
                            items={teams}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="team"
                />
            </div>
            <div className="flex">
                <FormInput<Player, "country">
                    label={t('pages.players.form.country.label')}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorSelect
                            initialValue={value}
                            items={countryCodes}
                            nameKey="name_en"
                            placeholder={t('pages.players.form.country.placeholder')}
                            valueKey="code"
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="country"
                />
                <div className="p-2"></div>
                <FormInput<Player, "city">
                    label={t('pages.players.form.city.label')}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t('pages.players.form.city.placeholder')} value={value} onChange={e => onChange({ target: { value: e.target.value } })} />
                    )}
                    name="city"
                />
            </div>
            <div className="flex">
                <FormInput<Player, "email">
                    label={t('pages.players.form.email.label')}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput placeholder={t('pages.players.form.email.placeholder')} value={value} onChange={e => onChange({ target: { value: e.target.value } })} />
                    )}
                    name="email"
                />
                <div className="p-2"></div>
                <FormInput<Player, "phoneNumber">
                    label={t('pages.players.form.phoneNumber.label')}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput
                            placeholder={t('pages.players.form.phoneNumber.placeholder')}
                            value={value}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="phoneNumber"
                />
                <div className="p-2"></div>
                <FormInput<Player, "icePhoneNumber">
                    label={t('pages.players.form.icePhoneNumber.label')}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorInput
                            placeholder={t('pages.players.form.icePhoneNumber.placeholder')}
                            value={value}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="icePhoneNumber"
                />
            </div>
            <div className="flex">
                <FormInput<Player, "startTime">
                    label={t('pages.players.form.startTime.label')}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorTimepicker
                            placeholder={t('pages.players.form.startTime.placeholder')}
                            value={value}
                            onChange={e => onChange({ target: { value: e.target.value } })}
                        />
                    )}
                    name="startTime"
                />
            </div>
            <div className="mt-4 justify-between flex">
                <Button onClick={onReject} outline>
                    {t("shared.cancel")}
                </Button>
                <Button type="submit">{t("shared.save")}</Button>
            </div>
        </Form>
    );

    // return (
    //     <div className="flex flex-col">
    //         <div className="flex">
    //             <div className="grow basis-full">
    //                 <Label>Classification</Label>
    //                 {classifications && classifications.length ? (
    //                     <PoorSelect
    //                         initialValue={player.classificationId}
    //                         items={classifications}
    //                         nameKey="name"
    //                         valueKey="id"
    //                         onChange={changeHandler("classificationId")}
    //                     ></PoorSelect>
    //                 ) : null}
    //             </div>
    //             <div className="p-2"></div>
    //             <div className="grow basis-full">
    //                 <Label>Bib Number</Label>
    //                 <PoorCombo
    //                     initialValue={player.bibNumber}
    //                     placeholder="bib number"
    //                     items={bibNumbers}
    //                     onChange={changeHandler("bibNumber")}
    //                 />
    //             </div>
    //         </div>
    //         <div className="p-2"></div>
    //         <div className="flex">
    //             <div className="grow">
    //                 <Label>Name</Label>
    //                 <PoorInput value={player.name} onChange={changeHandler("name")} />
    //             </div>
    //             <div className="p-2"></div>
    //             <div className="grow">
    //                 <Label>Last Name</Label>
    //                 <PoorInput value={player.lastName} onChange={changeHandler("lastName")} />
    //             </div>
    //         </div>
    //         <div className="p-2"></div>
    //         <div className="flex">
    //             <div className="grow basis-full">
    //                 <Label>Gender</Label>
    //                 <PoorSelect
    //                     initialValue={player.gender}
    //                     items={genders}
    //                     nameKey="name"
    //                     valueKey="value"
    //                     onChange={changeHandler("gender")}
    //                 />
    //             </div>
    //             <div className="p-2"></div>
    //             <div className="grow basis-full">
    //                 <Label>Birth Date</Label>
    //                 <PoorDatepicker value={player.birthDate} onChange={changeHandler("birthDate")} />
    //             </div>
    //         </div>
    //         <div className="p-2"></div>
    //         <div>
    //             <div>
    //                 <Label>Team</Label>
    //                 <PoorInput value={player.team} onChange={changeHandler("team")} />
    //             </div>
    //         </div>
    //         <div className="p-2"></div>
    //         <div className="flex">
    //             <div className="grow">
    //                 <Label>Country</Label>
    //                 <PoorInput value={player.country} onChange={changeHandler("country")} />
    //             </div>
    //             <div className="p-2"></div>
    //             <div className="grow">
    //                 <Label>City</Label>
    //                 <PoorInput value={player.city} onChange={changeHandler("city")} />
    //             </div>
    //         </div>
    //         <div className="p-2"></div>
    //         <div className="flex">
    //             <div className="grow">
    //                 <Label>Email</Label>
    //                 <PoorInput value={player.email} onChange={changeHandler("email")} />
    //             </div>
    //             <div className="p-2"></div>
    //             <div className="grow">
    //                 <Label>Phone Number</Label>
    //                 <PoorInput value={player.phoneNumber} onChange={changeHandler("phoneNumber")} />
    //             </div>
    //             <div className="p-2"></div>
    //             <div className="grow">
    //                 <Label>Ice Phone Number</Label>
    //                 <PoorInput value={player.icePhoneNumber} onChange={changeHandler("icePhoneNumber")} />
    //             </div>
    //         </div>
    //         <div className="p-2"></div>
    //         <div className="flex">
    //             <div className="grow">
    //                 <Label>Start Time</Label>
    //                 <PoorTimepicker value={player.startTime} onChange={changeHandler("startTime")} />
    //             </div>
    //         </div>
    //         <div className="mt-4 justify-between flex">
    //             <Button onClick={onReject} className="ml-2">
    //                 Cancel
    //             </Button>
    //             <Button onClick={() => onResolve({ ...player })}>Save</Button>
    //         </div>
    //     </div>
    // );
};
