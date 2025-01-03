import { where } from "sequelize"
import db from "../models/index"
require('dotenv').config();
import _, { includes } from "lodash";

let patientBookAppointmentService = (input) => {
    console.log('check input selectedDay: ', input.selectedDay, typeof input.selectedDay)
    let selectedDay = Number(input.selectedDay)
    console.log('check input selectedDay: ', selectedDay, typeof selectedDay)

    return new Promise(async (resolve, reject) => {

        try {
            if (!input.email) {
                console.log("--")
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })

            } else {

                let user = await db.User.findOrCreate({
                    where: { email: input.email },
                    defaults: {
                        email: input.email,
                        roleId: 'R3'
                    },
                });

                if (user) {

                    let data = await db.Booking.create({
                        statusId: input.statusId,
                        doctorId: input.doctorId,
                        patientId: user[0].id,
                        date: selectedDay,
                        // date: 1735837200000,
                        timeType: input.timeType,
                    })

                    console.log('check data: ', data)
                    resolve({
                        errCode: 0,
                        data: data
                    })
                }
                resolve({
                    errCode: 0,
                    data: [0]
                })

            }

        } catch (e) {
            reject(e)

        }
    })
}


module.exports = {
    patientBookAppointmentService: patientBookAppointmentService
}