import { where } from "sequelize"
import db from "../models/index"
require('dotenv').config();
import _, { includes } from "lodash";

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHomeService = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let topDoctors = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            })

            resolve({
                errCode: 0,
                data: topDoctors
            })
        } catch (e) {
            reject(e)
        }
    })
}
let getAllDoctorsService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.User.findAll({
                where: { roleId: 'R2' },
                order: [['createdAt']],
                attributes: {
                    exclude: ['password', 'image']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            })

            resolve({
                errCode: 0,
                data: doctor
            })
        } catch (e) {
            reject(e)
        }
    })
}
let saveDetailInfoDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        console.log('check inputdata', inputData)
        try {
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown ||
                !inputData.selectedPrice || !inputData.selectedProvince || !inputData.selectedPayment ||
                !inputData.addressClinic || !inputData.nameClinic) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'

                })
            } else {
                await db.Markdown.upsert({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                }, { where: { doctorId: inputData.doctorId } });
                await db.Doctor_Info.upsert({
                    doctorId: inputData.doctorId,
                    priceId: inputData.selectedPrice,
                    provinceId: inputData.selectedProvince,
                    paymentId: inputData.selectedPayment,
                    addressClinic: inputData.addressClinic,
                    nameClinic: inputData.nameClinic,
                    note: inputData.note,
                }, { where: { doctorId: inputData.doctorId } });
                resolve({
                    errCode: 0,
                    errMessage: 'Save Info Doctor Success'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getDetailDoctorByIdService = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                console.log("-")
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Markdown, attributes: ['contentHTML', 'contentMarkdown', 'description'] },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Info,
                            attributes: {
                                exclude: ['id', 'doctorId', 'createAt', 'updateAt']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        },

                    ],
                    raw: true,
                    nest: true
                })
                console.log("--")


                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let bulkCreateScheduleService = (input) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!input.data || !input.date || !input.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let schedule = input.data;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }
                console.log('schedule send', schedule);


                const existingSchedules = await db.Schedule.findAll({
                    where: {
                        doctorId: input.doctorId,
                        date: input.date
                    },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber']
                })
                console.log('---------------------------------------')
                console.log('existingSchedules: ', existingSchedules)

                const newSchedules = _.differenceWith(schedule, existingSchedules, (a, b) => {
                    return a.date === b.date.getTime()
                        && a.timeType === b.timeType
                        && a.doctorId === b.doctorId;
                });
                console.log('---------------------------------------')
                console.log('check newSchedules: ', newSchedules)
                if (newSchedules && newSchedules.length > 0) {
                    await db.Schedule.bulkCreate(newSchedules);
                    resolve({
                        errCode: 0,
                        errMessage: 'ok'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Các giờ khám đã tồn tại trong DB'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}
let getDoctorScheduleByIdService = (inputDoctorId, inputDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputDoctorId || !inputDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let schedule = await db.Schedule.findAll({
                    where: {
                        doctorId: inputDoctorId,
                        date: new Date(Number(inputDate))
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: schedule
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getTopDoctorHomeService: getTopDoctorHomeService,
    getAllDoctorsService: getAllDoctorsService,
    saveDetailInfoDoctor: saveDetailInfoDoctor,
    getDetailDoctorByIdService: getDetailDoctorByIdService,
    bulkCreateScheduleService: bulkCreateScheduleService,
    getDoctorScheduleByIdService: getDoctorScheduleByIdService,
}