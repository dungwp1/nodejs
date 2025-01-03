import { where } from "sequelize"
import db from "../models/index"
require('dotenv').config();
import _, { includes } from "lodash";

let patientBookAppointmentService = (input) => {
    let selectedDay = Number(input.selectedDay)
    console.log('check input selectedDay: ', selectedDay, typeof selectedDay)

    return new Promise(async (resolve, reject) => {

        try {
            if (!input.email) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })

            } else {
                let user = ''
                let isFoundUser = await db.User.findOne({
                    where: { email: input.email },
                    raw: false,
                });
                console.log("isFoundUser", isFoundUser)
                if (isFoundUser) {
                    console.log('case update: ', isFoundUser);

                    isFoundUser.email = input.email;
                    isFoundUser.phoneNumber = input.phoneNumber;
                    isFoundUser.gender = input.gender;
                    isFoundUser.firstName = input.firstName;
                    isFoundUser.lastName = input.lastName;
                    isFoundUser.roleId = 'R3';
                    console.log('check isFoundUser user: ', isFoundUser);

                    await isFoundUser.save();
                    user = isFoundUser.toJSON();
                    console.log('check update user: ', user)

                } else {
                    console.log("case create")

                    user = await db.User.create({
                        email: input.email,
                        phoneNumber: input.phoneNumber,
                        gender: input.gender,
                        firstName: input.firstName,
                        lastName: input.lastName,
                        roleId: 'R3'
                    });
                    console.log('check create user: ', user)

                }
                console.log('check user id: ', user.id)

                let data = await db.Booking.create({
                    statusId: input.statusId,
                    doctorId: input.doctorId,
                    patientId: user.id,
                    date: selectedDay,
                    timeType: input.timeType,
                })

                console.log('check data: ', data)
                resolve({
                    errCode: 0,
                    errMessage: 'Save Info Booking Success'
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