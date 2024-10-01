const {User, Staff, Customer, Position} = require('../models');
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
class UserController{
    // [GET] /api/users/auth
    getUsers(req, res, next){
        console.log(req.user)
        res.status(200).json(req.user)
    }
    // [POST] /api/users/register
    async register(req, res, next) {
        const {username, password, typeRegister} = req.body
        console.log([username, password, typeRegister])
        if(!username || !password){
            return res.status(302).json("Not have username or password")
        }
        //Kiểm tra người dùng có tồn tại?
        const userfind = await User.findOne({ where: { user_name: username } });
        if(userfind){
            res.status(302).json("Username has already been created")
        }
        const hash = bcrypt.hashSync(password, 10);
        let newUsername = await User.create({
                user_name: username,
                password: hash,
            });
        
        async function createCustomer(user){
            await Customer.create({
                custom_name: user.name,
                year_of_birth: user.year,
                id_card: user.cccd,
                address: user.address,
                phone_number: user.phone,
                state_account: 'active',
                UserId: newUsername.id
            },{
                include: [ User ]
            })
        }
        async function createStaff(user){
            await Staff.create({
                staff_name: user.name,
                birthday: user.birthday,
                staff_email: user.email,
                staff_phone: user.phone,
                staff_status: 'active', 
                PositionId: user.position,
                UserId: newUsername.id
            },{
                include: [ User, Position ]
            })
        }
        if(typeRegister == 'customer')
            createCustomer(req.body)
        else 
            createStaff(req.body)
        res.status(200).json('success')
    }
    // [PUT] /user/update/:id - only update customer
    async updateProfile(req, res) {
        const { name, year, cccd, phone} = req.body
        const { id_user} = req.params
        await Customer.update(
            {
                custom_name: name,
                year_of_birth: year,
                id_card: cccd,
                phone_number: phone,
            },
            {where: {UserId: id_user}}
        )
        res.status(200).json('success')
    }
    // [PUT] /user/changepassword/:id
    async changePassword(req, res) {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findOne({ where: { user_name: req.user.username } });

        bcrypt.compare(oldPassword, user.password).then(async (match) => {
            if (!match) res.json({ error: "Wrong Password Entered!" });

            bcrypt.hash(newPassword, 10).then((hash) => {
            User.update(
                { password: hash },
                { where: { user_name: req.user.user_name } }
            );
            res.status(200).json("SUCCESS");
            });

    });
    }
    // [POST] /login
    async login(req, res){
        const { username, password } = req.body;
        const user = await User.findOne({ where: { user_name: username } });
        if (!user) return res.status(302).json({ error: "User Doesn't Exist"});
        // Tìm kiếm nhân viên hoặc khách hàng
        let role = 'customer';
        const staff = await Staff.findOne({ where: {UserId: user.id} });
        // const customer = await Customer.findOne({ where: {UserId: user.id} });
        if(staff) role = 'staff';
        bcrypt.compare(password, user.password) 
        .then(async (match) => {
            if (!match) 
                res.json({ error: "Wrong Username And Password Combination" });
            const accessToken = sign(
                { username: user.user_name, id: user.id, role: role },
                "importantsecret"
            );
            res.json({ token: accessToken, username: username, id: user.id, role: role });
        });
    }
    
}

module.exports = new UserController