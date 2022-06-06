"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = exports.ValidRegister = void 0;
// const registerSchema = Joi.object({
//   firstname: Joi.string().min(3).max(20).required,
//   lastname: Joi.string().min(3).max(20).required,
//   phone: Joi.string()
//     .length(10)
//     .pattern(/^[0-9]+$/)
//     .required(),
//   office: Joi.string().required(),
//   email: Joi.string().email(),
//   password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
// }).options({ abortEarly: false });
// export default registerSchema;
const ValidRegister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstname, lastname, phone, office, email, password } = req.body;
    const errors = [];
    if (!firstname) {
        errors.push('Please add your firstname.');
    }
    else if (firstname.length > 20) {
        errors.push('Your firstname is up to 20 chars long.');
    }
    if (!lastname) {
        errors.push('Please add your lastname.');
    }
    else if (lastname.length > 20) {
        errors.push('Your lastname is up to 20 chars long.');
    }
    if (!phone) {
        errors.push('Please add your phone.');
    }
    else if (phone.length > 20) {
        errors.push('Your phone is up to 11 chars long.');
    }
    if (!office) {
        errors.push('Please add your office.');
    }
    if (!email) {
        errors.push('Please add your email.');
    }
    else if (!(0, exports.validateEmail)(email)) {
        errors.push('Email is incorrect.');
    }
    if (password.length < 8) {
        errors.push('Password must be at least 8 chars.');
    }
    if (errors.length > 0)
        return res.status(400).json({ msg: errors });
    next();
});
exports.ValidRegister = ValidRegister;
const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};
exports.validateEmail = validateEmail;
