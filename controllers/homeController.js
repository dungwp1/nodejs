import db from '../models/index';
import user from '../models/user';
import CRUDServices from '../services/CRUDServices';

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        })
    } catch (e) {
        console.log(e)
    }
}

let getAboutPage = (req, res) => {
    return res.render('test/about.ejs')
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs')
}

let postCRUD = async (req, res) => {
    let message = await CRUDServices.createNewUser(req.body);
    console.log(message);
    return res.send('post curd from server');
}

let displaygetCRUD = async (req, res) => {
    let data = await CRUDServices.getAllUser();
    console.log('-----------')
    console.log(data)
    console.log('-----------')
    return res.render('displayCRUD.ejs', {
        dataTable: data
    })
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDServices.getUserInfoById(userId);
        //check user data not found
        return res.render('editCRUD.ejs', {
            user: userData
        })

    } else {
        return res.send('User not found')
    }
}

let putCRUD = async (req, res) => {
    let data = req.body;
    let allUser = await CRUDServices.updateUserData(data);
    return res.render('displayCRUD.ejs', {
        dataTable: allUser
    })

    // let message = await CRUDServices.createNewUser(req.body);
    // console.log(message);
    // return res.send('post curd from server');
}

let deleteCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        await CRUDServices.deleteUserById(userId);
        return res.send('delete user succeed')
    } else {
        return res.send('user not found')

    }


}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displaygetCRUD: displaygetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
} 