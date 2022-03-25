import { NextFunction, Request, Response } from 'express';
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
export const ValidRegister = async (req: Request, res: Response, next: NextFunction) => {
  const { firstname, lastname, phone, office, email, password } = req.body;

  const errors = [];

  if (!firstname) {
    errors.push('Please add your firstname.');
  } else if (firstname.length > 20) {
    errors.push('Your firstname is up to 20 chars long.');
  }

  if (!lastname) {
    errors.push('Please add your lastname.');
  } else if (lastname.length > 20) {
    errors.push('Your lastname is up to 20 chars long.');
  }

  if (!phone) {
    errors.push('Please add your phone.');
  } else if (phone.length > 20) {
    errors.push('Your phone is up to 11 chars long.');
  }

  if (!office) {
    errors.push('Please add your office.');
  }

  if (!email) {
    errors.push('Please add your email.');
  } else if (!validateEmail(email)) {
    errors.push('Email is incorrect.');
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 chars.');
  }

  if (errors.length > 0) return res.status(400).json({ msg: errors });
  next();
};

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
