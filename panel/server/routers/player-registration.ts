import { playerRegistrationErrors } from "modules/player-registration/errors";
import nodemailer from "nodemailer";
import { z } from "zod";
import { env } from "../../env";
import type { CountryCode } from "../../modules/player-registration/models";
import { racePlayerRegistrationSchema } from "../../modules/player-registration/models";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { getRegistrationState } from "modules/race/models";

export const playerRegistrationRouter = router({
    registrations: protectedProcedure
        .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
        .query(async ({ input, ctx }) => {
            const { raceId } = input;
            const registrations = await ctx.db.playerRegistration.findMany({
                where: { raceId: raceId },
                include: { player: true, profile: true },
            });

            return registrations.map((r, index) => ({
                ...r.profile,
                ...r,
                country: r.profile.country as CountryCode,
                index: index + 1,
                promotedToPlayer: r.player.length > 0,
            }));
        }),
    teams: publicProcedure.input(z.object({ raceId: z.number({ required_error: "raceId is required" }) })).query(async ({ input, ctx }) => {
        const { raceId } = input;

        const results = await ctx.db.playerProfile.groupBy({ by: ["team"], where: { raceId: Number(raceId), team: { not: null } } });

        return results.map(r => r.team!);
    }),
    registrationStatus: publicProcedure
        .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
        .query(async ({ input, ctx }) => {
            const { raceId } = input;

            const race = await ctx.db.race.findFirstOrThrow({ where: { id: raceId } });

            const registeredPlayers = await ctx.db.playerRegistration.count({ where: { raceId } });

            return {
                limit: race.playersLimit,
                registered: registeredPlayers,
                raceName: race.name,
                raceDate: race.date,
                termsUrl: race.termsUrl,
                state: getRegistrationState(race, registeredPlayers),
            };
        }),
    register: publicProcedure.input(racePlayerRegistrationSchema).mutation(async ({ input, ctx }) => {
        const race = await ctx.db.race.findFirstOrThrow({ where: { id: input.raceId }, include: { playerRegistration: true } });

        const raceRegistrationsCount = race.playerRegistration.length;

        const state = getRegistrationState(race, raceRegistrationsCount);

        if (state === "disabled") throw playerRegistrationErrors.REGISTRATION_DISABLED;

        if (state === "limit-reached") throw playerRegistrationErrors.REGISTRATION_LIMIT_REACHED;

        if (state === "cutoff") throw playerRegistrationErrors.REGISTRATION_CUTOFF;

        const profile = await ctx.db.playerProfile.create({
            data: {
                raceId: input.raceId,
                name: input.player.name.trim(),
                lastName: input.player.lastName.trim(),
                gender: input.player.gender,
                birthDate: input.player.birthDate,
                country: input.player.country,
                city: input.player.city.trim(),
                team: input.player.team?.trim(),
                email: input.player.email,
                phoneNumber: input.player.phoneNumber,
                icePhoneNumber: input.player.icePhoneNumber,
            },
        });

        await ctx.db.playerRegistration.create({
            data: {
                raceId: input.raceId,
                registrationDate: new Date(),
                hasPaid: false,
                playerProfileId: profile.id,
            },
        });

        await sendRegistrationConfirmation({
            email: input.player.email,
            raceName: race.name,
            template: race.emailTemplate,
            placeholderValues: [
                ["name", input.player.name.trim()],
                ["lastName", input.player.lastName.trim()],
                ["raceName", race.name],
                ["raceDate", race.date.toLocaleDateString("pl-PL", { timeZone: "Europe/Warsaw" })],
            ],
        });
    }),
    delete: protectedProcedure.input(z.object({ id: z.number(), raceId: z.number() })).mutation(async ({ input, ctx }) => {
        const playerExists = await ctx.db.player.findUnique({
            where: {
                raceId_playerRegistrationId: {
                    raceId: input.raceId,
                    playerRegistrationId: input.id,
                },
            },
        });

        if (playerExists) {
            throw playerRegistrationErrors.REGISTRATION_PROMOTED_TO_PLAYER;
        }

        return await ctx.db.playerRegistration.delete({ where: { id: input.id } });
    }),
    setPaymentStatus: protectedProcedure
        .input(z.object({ playerId: z.number(), hasPaid: z.boolean() }))
        .mutation(async ({ input, ctx }) => {
            return await ctx.db.playerRegistration.update({
                where: { id: input.playerId },
                data: { hasPaid: input.hasPaid, paymentDate: input.hasPaid ? new Date() : null },
            });
        }),
    add: protectedProcedure.input(racePlayerRegistrationSchema).mutation(async ({ input, ctx }) => {
        const race = await ctx.db.race.findFirstOrThrow({ where: { id: input.raceId }, include: { playerRegistration: true } });

        const raceRegistrationsCount = race.playerRegistration.length;

        if (race.playersLimit && race.playersLimit <= raceRegistrationsCount) {
            throw playerRegistrationErrors.EXCEEDED_NUMBER_OF_REGISTRATIONS;
        }

        const profile = await ctx.db.playerProfile.create({
            data: {
                raceId: input.raceId,
                name: input.player.name.trim(),
                lastName: input.player.lastName.trim(),
                gender: input.player.gender,
                birthDate: input.player.birthDate,
                country: input.player.country,
                city: input.player.city.trim(),
                team: input.player.team?.trim(),
                email: input.player.email,
                phoneNumber: input.player.phoneNumber,
                icePhoneNumber: input.player.icePhoneNumber,
            },
        });

        return await ctx.db.playerRegistration.create({
            data: {
                raceId: input.raceId,
                registrationDate: new Date(),
                hasPaid: false,
                playerProfileId: profile.id,
            },
        });
    }),
    edit: protectedProcedure.input(racePlayerRegistrationSchema).mutation(async ({ input, ctx }) => {
        const playerRegistration = await ctx.db.playerRegistration.findFirstOrThrow({ where: { id: input.player.id! } });
        return await ctx.db.playerProfile.update({
            where: { id: playerRegistration.playerProfileId },
            data: {
                name: input.player.name.trim(),
                lastName: input.player.lastName.trim(),
                gender: input.player.gender,
                birthDate: input.player.birthDate,
                country: input.player.country,
                city: input.player.city.trim(),
                team: input.player.team?.trim(),
                email: input.player.email,
                phoneNumber: input.player.phoneNumber,
                icePhoneNumber: input.player.icePhoneNumber,
            },
        });
    }),
    totalRegistrations: protectedProcedure.input(z.object({ raceId: z.number() })).query(async ({ input, ctx }) => {
        return await ctx.db.playerRegistration.count({ where: { raceId: input.raceId } });
    }),
});

export type PlayerRouter = typeof playerRegistrationRouter;

const transporter = nodemailer.createTransport({
    host: env.NOTIFICATIONS_SERVER_HOST,
    port: parseInt(env.NOTIFICATIONS_SERVER_PORT),
    secure: env.NOTIFICATIONS_SERVER_SECURE,
    auth: {
        user: env.NOTIFICATIONS_SERVER_AUTH_USER,
        pass: env.NOTIFICATIONS_SERVER_AUTH_PASS,
    },
} as any);

type ConfirmationTarget = {
    email: string;
    raceName: string;
    template: string | null;
    placeholderValues: [string, string][];
};

export const sendRegistrationConfirmation = async ({ email, raceName, template, placeholderValues }: ConfirmationTarget) =>
    new Promise<void>((res, rej) => {
        const finalTemplate = defaultTemplate.replace("%template%", template ?? "");

        const [_, __, messageContent] = placeholderValues.reduce(
            ([_, __, template], [placeholder, value]) => ["", "", template.replaceAll(`%${placeholder}%`, value)],
            ["", "", finalTemplate],
        );

        const message = {
            from: env.NOTIFICATIONS_MESSAGE_FROM,
            bcc: email,
            subject: `${raceName} - potwierdzenie rejestracji w zawodach`,
            html: messageContent,
            replyTo: `${env.NOTIFICATIONS_MESSAGE_FROM} <${env.NOTIFICATIONS_MESSAGE_TARGET}>`,
        };

        transporter.sendMail(message, err => {
            if (err) {
                rej(err);
            } else {
                res();
            }
        });
    });

export const defaultTemplate = `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <style>
      @media only screen and (max-width: 620px) {
        table.body h1 {
          font-size: 28px !important;
          margin-bottom: 10px !important;
        }

        table.body p,
        table.body ul,
        table.body ol,
        table.body td,
        table.body span,
        table.body a {
          font-size: 16px !important;
        }

        table.body .wrapper,
        table.body .article {
          padding: 10px !important;
        }

        table.body .content {
          padding: 0 !important;
        }

        table.body .container {
          padding: 0 !important;
          width: 100% !important;
        }

        table.body .main {
          border-left-width: 0 !important;
          border-radius: 0 !important;
          border-right-width: 0 !important;
        }

        table.body .btn table {
          width: 100% !important;
        }

        table.body .btn a {
          width: 100% !important;
        }

        table.body .img-responsive {
          height: auto !important;
          max-width: 100% !important;
          width: auto !important;
        }
      }
      @media all {
        .ExternalClass {
          width: 100%;
        }

        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
          line-height: 100%;
        }

        .apple-link a {
          color: inherit !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          text-decoration: none !important;
        }

        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
          font-size: inherit;
          font-family: inherit;
          font-weight: inherit;
          line-height: inherit;
        }

        .btn-primary table td:hover {
          background-color: #34495e !important;
        }

        .btn-primary a:hover {
          background-color: #34495e !important;
          border-color: #34495e !important;
        }
      }
    </style>
  </head>
  <body
    style="
      background-color: #f6f6f6;
      font-family: sans-serif;
      -webkit-font-smoothing: antialiased;
      font-size: 14px;
      line-height: 1.4;
      margin: 0;
      padding: 0;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    "
  >
    <table
      role="presentation"
      border="0"
      cellpadding="0"
      cellspacing="0"
      class="body"
      style="
        border-collapse: separate;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        background-color: #f6f6f6;
        width: 100%;
      "
      width="100%"
      bgcolor="#f6f6f6"
    >
      <tr>
        <td
          style="font-family: sans-serif; font-size: 14px; vertical-align: top"
          valign="top"
        >
          &nbsp;
        </td>
        <td
          class="container"
          style="
            font-family: sans-serif;
            font-size: 14px;
            vertical-align: top;
            display: block;
            max-width: 580px;
            padding: 10px;
            width: 580px;
            margin: 0 auto;
          "
          width="580"
          valign="top"
        >
          <div
            class="content"
            style="
              box-sizing: border-box;
              display: block;
              margin: 0 auto;
              max-width: 580px;
              padding: 10px;
            "
          >
            <!-- START CENTERED WHITE CONTAINER -->
            <table
              role="presentation"
              class="main"
              style="
                border-collapse: separate;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                background: #ffffff;
                border-radius: 3px;
                width: 100%;
              "
              width="100%"
            >
              <!-- START MAIN CONTENT AREA -->
              <tr>
                <td
                  class="wrapper"
                  style="
                    font-family: sans-serif;
                    font-size: 14px;
                    vertical-align: top;
                    box-sizing: border-box;
                    padding: 20px;
                  "
                  valign="top"
                >
                  <table
                    role="presentation"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                      border-collapse: separate;
                      mso-table-lspace: 0pt;
                      mso-table-rspace: 0pt;
                      width: 100%;
                    "
                    width="100%"
                  >
                    <tr>
                      <td
                        style="
                          font-family: sans-serif;
                          font-size: 14px;
                          vertical-align: top;
                        "
                        valign="top"
                      >
                        <p
                          style="
                            font-family: sans-serif;
                            font-size: 24px;
                            font-weight: bold;
                            margin: 0;
                            margin-bottom: 50px;
                          "
                        >
                          Rejestracja w %raceName%
                        </p>
                        <p
                          style="
                            font-family: sans-serif;
                            font-size: 14px;
                            font-weight: normal;
                            margin: 0;
                            margin-bottom: 15px;
                          "
                        >
                          Cześć %name% %lastName%!
                        </p>
                        <p
                          style="
                            font-family: sans-serif;
                            font-size: 14px;
                            font-weight: normal;
                            margin: 0;
                            margin-bottom: 15px;
                          "
                        >
                          Zarejestrowałeś się w %raceName% (%raceDate%).
                        </p>
                        <p
                        style="
                          font-family: sans-serif;
                          font-size: 14px;
                          font-weight: normal;
                          margin: 0;
                          margin-bottom: 15px;
                        "
                      >
                        %template%
                      </p>
                        <p
                          style="
                            font-family: sans-serif;
                            font-size: 14px;
                            font-weight: normal;
                            margin: 0;
                            margin-bottom: 15px;
                          "
                        >
                          W przypadku jakichkolwiek pytań czy też problemów z
                          wzięciem udziału w zawodach, gorąco zapraszamy Cię do
                          kontaktu z Biurem Organizatora Zawodów.
                        </p>

                        <p
                          style="
                            font-family: sans-serif;
                            font-size: 14px;
                            font-weight: normal;
                            margin: 0;
                            margin-bottom: 15px;
                          "
                        >
                          Do zobaczenia na starcie!
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- END MAIN CONTENT AREA -->
            </table>
            <!-- END CENTERED WHITE CONTAINER -->

            <!-- START FOOTER -->
            <!-- END FOOTER -->
          </div>
        </td>
        <td
          style="font-family: sans-serif; font-size: 14px; vertical-align: top"
          valign="top"
        >
          &nbsp;
        </td>
      </tr>
    </table>
  </body>
</html>`;
