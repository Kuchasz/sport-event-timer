import { NextApiRequest, NextApiResponse } from "next";
import { db } from "server/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {

    const { raceId } = req.query;

console.log('raceId: ', raceId);

    const {
        name,
        lastName,
        birthDate,
        gender,
        team,
        city,
        country,
        email,
        phoneNumber,
        icePhoneNumber } = req.body;

    const id = await db.playerRegistration.create({ 
        data: { 
            raceId: parseInt(raceId as string), 
            name, 
            lastName, 
            birthDate: new Date(birthDate),
            gender, 
            team, 
            city, 
            country, 
            email, 
            phoneNumber, 
            icePhoneNumber 
        } 
    });

    res.send(id);
};