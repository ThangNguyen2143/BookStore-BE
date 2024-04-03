const {User, Staff, Customer, Position} = require('../models');
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
class UserController{
    
    // [POST] /user/register
    async register(req, res, next) {
        const {username, password, typeRegister} = req.body
        if(!username || !password){
            return res.status(302).json({message: "Not have username or password"})
        }
        
        //Kiểm tra người dùng có tồn tại?
        const userfind = await User.findOne({ where: { user_name: username } });
        if(userfind){
            res.status(302).json({message: "Username has already been created"})
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
    // [PUT] /user/update/:id
    async updateUser(req, res) {
        
    }
    // [POST] /login
    async login(req, res){
        const { username, password } = req.body;

        const user = await User.findOne({ where: { user_name: username } });

        if (!user) res.status(302).json({ error: "User Doesn't Exist" });

        bcrypt.compare(password, user.password) 
        .then(async (match) => {
            if (!match) 
                res.json({ error: "Wrong Username And Password Combination" });
            // Cài đặt phân quyền tại đây
            // ...
            const accessToken = sign(
                { username: user.user_name, id: user.id },
                "importantsecret"
            );
            res.json({ token: accessToken, username: username, id: user.id });
        });
    }
    
}

module.exports = new UserController