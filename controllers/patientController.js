import patientService from "../services/patientService"

let patientBookAppointment = async (req, res) => {
    try {
        let response = await patientService.patientBookAppointmentService(req.body);
        return res.status(200).json(response)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })

    }
}


module.exports = {
    patientBookAppointment: patientBookAppointment,
}